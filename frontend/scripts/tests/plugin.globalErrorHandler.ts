import { config } from '@vue/test-utils'
import { vi } from 'vitest'

import globalErrorHandler from '#plugins/globalErrorHandler'

export const errorHandlerSpy = vi.spyOn(globalErrorHandler, 'error')
export const warningHandlerSpy = vi.spyOn(globalErrorHandler, 'warning')

config.global.plugins.push(globalErrorHandler)
