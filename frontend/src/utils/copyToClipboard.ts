import GlobalErrorHandler from '#plugins/globalErrorHandler'

export const copyToClipboard = async () => {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch (err) {
    GlobalErrorHandler.error('Failed to url: ', err)
  }
}
