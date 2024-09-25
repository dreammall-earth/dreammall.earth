import { mount } from '@vue/test-utils'
import { vi, describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'

import { globalErrorHandler, toastErrors } from './globalErrorHandler'

describe('GlobalErrorHandler', () => {
  describe('given a component throwing an unexpected runtime error', () => {
    const toast = { error: vi.fn() }
    const console = { error: vi.fn() }
    const dependencies = { toast, console }

    const component = defineComponent({
      setup: () => {
        throw new Error('Boom!')
      },
      template: '<template><h1>Hello World</h1></template>',
    })

    it('toasts error message', () => {
      const plugin = globalErrorHandler(toastErrors(dependencies))
      const setup = () => mount(component, { global: { plugins: [plugin] } })
      expect(setup).toThrow('Boom!')
      expect(dependencies.toast.error).toHaveBeenCalledWith('Unhandled Error: Boom!')
    })
  })
})
