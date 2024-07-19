import { PageContext } from 'vike/types'

import pinia from '#plugins/pinia.js'

import { createApp } from './app'
import { getTitle } from './utils'

import type { StateTree } from 'pinia'

let instance: ReturnType<typeof createApp>
/* async */ function render(pageContext: PageContext) {
  if (
    'initialStoreState' in pageContext &&
    pageContext.initialStoreState &&
    typeof pageContext.initialStoreState === 'string'
  ) {
    pinia.state.value = JSON.parse(pageContext.initialStoreState) as Record<string, StateTree>
  }

  if (!instance) {
    instance = createApp(pageContext)
    instance.app.mount('#app')
  } else {
    instance.app.changePage(pageContext)
  }

  document.title = getTitle(pageContext)
}

export default render
