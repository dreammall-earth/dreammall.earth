import { App } from 'vue'
import { toast } from 'vue3-toastify'

const handleError = (message: string, data?: unknown) => {
  if (data) {
    // eslint-disable-next-line no-console
    console.error('error: ' + message, data)
  } else {
    // eslint-disable-next-line no-console
    console.error('error: ' + message)
  }
  toast.error(message)
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
