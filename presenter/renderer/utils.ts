import { PageContext } from 'vike/types'

import i18n from '#plugins/i18n'
import { META } from '#src/env'

function getTitle(pageContext: PageContext) {
  // The value exported by /pages/**/+title.js is available at pageContext.config.title
  const val = pageContext.config.title
  if (typeof val === 'string') return val
  if (typeof val === 'function') return String(val(pageContext))
  return i18n.global.t('title')
}
function getDescription(pageContext: PageContext) {
  const val = pageContext.config.description
  if (typeof val === 'string') return val
  if (typeof val === 'function') return val(pageContext)
  return META.DEFAULT_DESCRIPTION
}

export { getTitle, getDescription }
