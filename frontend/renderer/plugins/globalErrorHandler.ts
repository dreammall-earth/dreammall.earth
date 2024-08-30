import { App } from 'vue'
import { toast } from 'vue3-toastify'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleError = (message: string, _data?: unknown) => {
  toast.error(message)
  // TODO log errors while developing, but not in tests
  // console.error(message, data)
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
