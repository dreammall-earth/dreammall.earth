import { ILogObj, Logger } from 'tslog'

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class LoggerSingleton {
  private static instance: Logger<ILogObj>

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Logger<ILogObj> {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new Logger({ name: 'mainLogger' })
    }

    return LoggerSingleton.instance
  }
}

const logger = LoggerSingleton.getInstance()
export default logger
type DreammallLogger = typeof logger
export type { DreammallLogger as Logger }
