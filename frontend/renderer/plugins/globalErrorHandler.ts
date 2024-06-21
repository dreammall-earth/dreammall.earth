import { App } from 'vue'
import { toast } from 'vue3-toastify'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (message: string, data?: unknown) => {
  toast.error(message)
}
const handleWarning = (message: string) => {
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
