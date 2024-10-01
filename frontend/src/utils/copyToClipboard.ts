import type { toast as Toast } from 'vue3-toastify'

export const copyToClipboard = (toast: typeof Toast | undefined) => {
  if (!toast) {
    throw new Error('`toast` dependency is undefined')
  }
  return async (data: string, successMessage: string | null = null) => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(data)
      if (successMessage) toast.success(successMessage)
    } catch (cause) {
      throw new Error('Failed to url: ', { cause })
    }
  }
}
