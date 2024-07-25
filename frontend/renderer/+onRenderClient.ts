import { PageContext } from 'vike/types'

import pinia from '#plugins/pinia.js'

import { createApp } from './app'
import { getTitle } from './utils'

import type { StateTree } from 'pinia'

let instance: ReturnType<typeof createApp>
/* async */ function render(pageContext: PageContext) {
  if (!instance) {
    if (
      'initialStoreState' in pageContext &&
      pageContext.initialStoreState &&
      typeof pageContext.initialStoreState === 'string'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, security/detect-eval-with-expression, no-eval
      pinia.state.value = eval(pageContext.initialStoreState)
    }
    instance = createApp(pageContext)
    instance.app.mount('#app')
  } else {
    instance.app.changePage(pageContext)
  }

  document.title = getTitle(pageContext)
}

export default render
