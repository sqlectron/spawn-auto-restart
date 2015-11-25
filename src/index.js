var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var debug = require('debug')('spawn-auto-restart');


module.exports = function (options) {
  if (!options || !options.proc || !options.watch) {
    throw new Error('Missing required arguments');
  }

  var proc;
  var restarting = false;

  // allows use all options available for spawn
  var procCommand = options.proc;
  var procArgs;
  var procOptions;
  if (typeof options.proc !== 'string') {
    procCommand = options.proc.command;
    procArgs = options.proc.args;
    if (!Array.isArray(procArgs)) {
      procArgs = (procArgs || '').split(' ');
    }
    procOptions = cloneObjWithoutProps(options.proc, ['command', 'args']);
  }

  // allows use all options available for chokidar
  var watchPath = options.watch;
  var watchOptions;
  if (!Array.isArray(options.watch) && typeof options.watch !== 'string') {
    watchPath = options.watch.path;
    procOptions = cloneObjWithoutProps(options.watch, ['path']);
  }

  // pipe all outputs and preserve colors
  procOptions = procOptions || {};
  procOptions.stdio = 'inherit';

  /**
   * start the child process
   */
  function start() {
    proc = spawn(procCommand, procArgs, procOptions);

    var onClose = function (code) {
      if (!restarting) {
        process.exit(code);
      }
      start();
      restarting = false;
    };

    proc.on('error', function () {
      debug('restarting due error');
      restarting = true;
      proc.kill('SIGINT');
    });

    proc.on('close', onClose);
  }

  // starts the child process for the first time
  start();

  // starts watching
  chokidar.watch(watchPath, watchOptions).on('change', function() {
    debug('restarting due changes');
    restarting = true;
    proc.kill('SIGINT');
  });
};


function cloneObjWithoutProps(src, props) {
  return Object.keys(src)
    .filter(function (key) { return ~props.indexOf(key); })
    .reduce(function (obj, key) {
      obj[key] = src[key];
      return obj;
    }, {});
}
