import GlobalErrorHandler from '#renderer/plugins/globalErrorHandler'

export const copyToClipboard = async (data: string, successMessage: string | null = null) => {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(data)
    if (successMessage) GlobalErrorHandler.success(successMessage)
  } catch (err) {
    GlobalErrorHandler.error('Failed to url: ', err)
  }
}
