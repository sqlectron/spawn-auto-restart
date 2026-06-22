import { SpawnOptionsWithoutStdio } from 'child_process';
import { WatchOptions } from 'chokidar';

export = spawnAutoRestart;

declare function spawnAutoRestart(options: spawnAutoRestart.Options): void;

declare namespace spawnAutoRestart {
  interface ProcConfig extends SpawnOptionsWithoutStdio {
    command: string;
    args?: string | string[];
  }

  interface WatchConfig extends WatchOptions {
    path: string | string[];
  }

  interface Options {
    proc: string | ProcConfig;
    watch: string | string[] | WatchConfig;
  }
}
