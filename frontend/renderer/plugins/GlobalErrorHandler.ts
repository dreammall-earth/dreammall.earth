import { App } from 'vue'
import { toast } from 'vue3-toastify'

const handleError = (message: string, data?: unknown) => {
  // eslint-disable-next-line no-console
  console.error('error: ' + message, data)
  toast.error(message, { delay: 0 })
}
const handleWarning = (message: string) => {
  // eslint-disable-next-line no-console
  console.log('warning: ' + message)
  toast.warning(message)
}

export default {
  install: (app: App) => {
    app.config.errorHandler = (error, vm, info) => {
      handleError(`Unhandled error occurred: ${info}`, error)
    }
  },
  error: handleError,
  warning: handleWarning,
}
