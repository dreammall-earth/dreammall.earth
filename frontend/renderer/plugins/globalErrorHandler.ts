import type { App, AppConfig } from 'vue'
import type { toast as Toast } from 'vue3-toastify'

type Dependencies = {
  console: Pick<typeof console, 'error'>
  toast: Pick<typeof Toast, 'error'>
}

const errorMessage = (error: unknown) => {
  if (error instanceof Error && error.cause) {
    // The error was wrapped, i. e. we "know" this error.
    return error.message
  }
  return `Unhandled ${String(error)}`
}

export const toastErrors: (deps: Dependencies) => AppConfig['errorHandler'] =
  ({ toast, console }) =>
  (error, _vm, info) => {
    toast.error(errorMessage(error))
    console.error(info, error)
  }

export const globalErrorHandler = (errorHandler: AppConfig['errorHandler']) => ({
  install: (app: App) => {
    app.config.errorHandler = errorHandler
  },
})
