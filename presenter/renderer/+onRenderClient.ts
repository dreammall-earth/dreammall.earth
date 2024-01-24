import { createApp } from './app'
import { getTitle } from './utils'

import type { PageContext, VikePageContext } from '#types/PageContext'

let instance: ReturnType<typeof createApp>
/* async */ function render(pageContext: VikePageContext & PageContext) {
  if (!instance) {
    instance = createApp(pageContext)
    instance.app.mount('#app')
  } else {
    instance.app.changePage(pageContext)
  }

  document.title = getTitle(pageContext)
}

export default render
