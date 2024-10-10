import type { CONFIG } from '#config/config'
import type { Logger } from '#src/logger'

export const printConfigError =
  ({ config, logger }: { config: typeof CONFIG; logger: Pick<Logger, 'warn'> }) =>
  (error: string) => {
    switch (config.NODE_ENV) {
      case 'test':
        return
      case 'production':
        throw new Error(error)
      default:
        logger.warn(error)
    }
  }
