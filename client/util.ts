

enum Level {
  TRACE = 2,
  DEBUG = 1,
  INFO = 0,
  WARN = -1,
  ERROR = -2,
  FATAL = -3,
  OFF = -4
};

class Logger {
  level: Level;
  public constructor(level?: Level) {
    this.level = Level.WARN;
  }

  log(level: Level, ...values: any[]) {
    if (this.level > level) console.log(`[${Level[level]}] `, )
    return [...values];
  }
}