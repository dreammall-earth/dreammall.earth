import { vi } from 'vitest'

import { globalErrorHandler } from '#plugins/globalErrorHandler'

import type { AppConfig } from 'vue'

export const createMockPlugin = () => {
  const errorSpy = vi.fn()
  const errorHandler: AppConfig['errorHandler'] = (error) => {
    errorSpy(error)
  }
  const mockPlugin = globalErrorHandler(errorHandler)
  return { mockPlugin, errorSpy }
}
