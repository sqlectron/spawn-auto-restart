var spawn = require('child_process').spawn;
var chokidar = require('chokidar');
var debug = require('debug');


module.exports = function (options) {
  if (!options || !options.proc || !options.watch) {
    throw new Error('Missing required arguments');
  }

  var proc;
  var restarting = false;

  if (options.debug) { debug.enable('spawn-auto-restart'); }
  var log = debug('spawn-auto-restart');

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
    delete options.proc.path;
    delete options.proc.args;
    procOptions = options.proc;
  }

  // allows use all options available for chokidar
  var watchPath = options.watch;
  var watchOptions;
  if (!Array.isArray(options.watch) && typeof options.watch !== 'string') {
    watchPath = options.watch.path;
    delete options.watch.path;
    watchOptions = options.watch;
  }

  /**
   * start the child process
   */
  function start() {
    proc = spawn(procCommand, procArgs, procOptions);

    proc.stdin.pipe(process.stdin);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    var onClose = function (code) {
      if (!restarting) {
        process.exit(code);
      }
      start();
      restarting = false;
    };

    proc.on('error', function () {
      log('restarting due error');
      restarting = true;
      proc.kill('SIGINT');
    });

    proc.on('close', onClose);
  }

  // starts the child process for the first time
  start();

  // starts watching
  chokidar.watch(watchPath, watchOptions).on('change', function() {
    log('restarting due changes');
    restarting = true;
    proc.kill('SIGINT');
  });
};
