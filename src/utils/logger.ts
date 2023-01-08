type LogLevel = "debug" | "info" | "warning" | "error";

const logLevels: { [level in LogLevel]: (message: string) => void } = {
  debug: console.debug,
  info: console.info,
  warning: console.warn,
  error: console.error,
};


function logWithLevel(level: LogLevel): (message: string) => void {
  return (message: string) => {
    const logger = logLevels[level];
    logger(message);
  };
}

class Logger {
  private enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  log(message: string, level: LogLevel) {
    if (!this.enabled) {
      return;
    }
    logWithLevel(level)(message);
  };

  setEnabled(value: boolean) {
    this.enabled = value;
  }
}


export const logger = new Logger(false);

