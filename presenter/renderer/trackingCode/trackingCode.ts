export const trackingCode = (websiteId: string | undefined) => {
  if (!websiteId) return ''
  return `<script defer src="https://cloud.umami.is/script.js" data-website-id="${websiteId}"></script>`
}
