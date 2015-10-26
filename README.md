# spawn auto restart

**Important: Use it for dev only!**

It executes a command through `spawn` and restart the process in case any change has been detected or the child process has crashed.

## Installation

Install via npm:

```bash
$ npm install spawn-auto-restart
```

## Usage

```js
require('spawn-auto-restart')({
  proc: 'executable path',
  watch: __dirname
});
```

To enable logs set an environment variable like this:

```shell
DEBUG=spawn-auto-restart
```

**advanced args options**

* [spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
* [chokidar](https://github.com/paulmillr/chokidar)

```js
require('spawn-auto-restart')({
  proc: {
    command: 'executable path',
    // ... any spawn argument
    args: ['--dev'],
    cwd: __dirname
  },
  watch: {
    path: 'file, dir, glob, or array',
    // ... any chokidar argument
    ignored: /[\/\\]\./,
    persistent: true
  }
});
```

## Example

Auto restarting an [electron](https://github.com/atom/electron) app in development when changes have been applied in the main process.

![](https://www.dropbox.com/s/gxird1lr72tq56s/spawn-auto-restart.gif?raw=1)

**node DEBUG=spawn-auto-restart restart.js**
```js
#!/usr/bin/env node

var join = require('path').join;
var electron = require('electron-prebuilt');


var main = join(__dirname, '../src/browser/main.js');
var watch = join(__dirname, '../src/browser');


require('spawn-auto-restart')({
  proc: {
    command: electron,
    args: main
  },
  watch: watch
});
```


## Changelog

**2.0.0**: [Move debug option to env variable](https://github.com/maxcnunes/spawn-auto-restart/commit/e8d85d7681d64ec9d8b1e5cefff25857208c070a).


## Contributing

It is required to use [editorconfig](http://editorconfig.org/).

## License

Copyright (c) 2015 Max Claus Nunes. This software is licensed under the [MIT License](http://raw.github.com/maxcnunes/spawn-auto-restart/master/LICENSE).
