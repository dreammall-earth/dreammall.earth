import { vi, describe, it, expect } from 'vitest'
import { toast } from 'vue3-toastify'

import globalErrorHandler from './globalErrorHandler'

// vi.mock('vue3-toastify', async (importOriginal) => {
//   const mod = await importOriginal<typeof import('vue3-toastify')>()
//   return {
//     ...mod,
//     error: vi.fn(),
//     warning: vi.fn(),
//   }
// })

describe('GlobalErrorHandler', () => {
  describe('Error', () => {
    const errorSpy = vi.spyOn(toast, 'error')

    it('toasts error message', () => {
      globalErrorHandler.error('someError')

      expect(errorSpy).toHaveBeenCalledWith('someError')
    })
  })

  describe('Warning', () => {
    const warningSpy = vi.spyOn(toast, 'warning')

    it('toasts warning message', () => {
      globalErrorHandler.warning('someWarning')

      expect(warningSpy).toHaveBeenCalledWith('someWarning')
    })
  })
})
