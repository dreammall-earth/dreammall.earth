import logger from '#src/logger'

export const printConfigError = (error: string) => {
  // eslint-disable-next-line n/no-process-env
  switch (process.env.NODE_ENV) {
    case 'test':
      return
    case 'production':
      throw new Error(error)
    default:
      logger.warn(error)
  }
}
