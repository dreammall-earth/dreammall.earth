import { vi, describe, it, expect } from 'vitest'
import { toast } from 'vue3-toastify'

import globalErrorHandler from './globalErrorHandler'

describe('GlobalErrorHandler', () => {
  describe('Error', () => {
    const errorSpy = vi.spyOn(toast, 'error')

    it('toasts error message', () => {
      globalErrorHandler.error('someError')

      expect(errorSpy).toBeCalledWith('someError')
    })
  })

  describe('Warning', () => {
    const warningSpy = vi.spyOn(toast, 'warning')

    it('toasts warning message', () => {
      globalErrorHandler.warning('someWarning')

      expect(warningSpy).toBeCalledWith('someWarning')
    })
  })
})
