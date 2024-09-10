import GlobalErrorHandler from '#plugins/globalErrorHandler'

export const copyToClipboard = async (data: string) => {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(data)
  } catch (err) {
    GlobalErrorHandler.error('Failed to url: ', err)
  }
}
