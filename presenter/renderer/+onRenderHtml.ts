import { renderToString as renderToString_ } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageContext, PageContextServer } from 'vike/types'
import { resolveComponent } from 'vue'

import logoUrl from '#assets/favicon.ico'
import image from '#assets/img/dreammall-logo_social.svg'
import { META } from '#src/env'

import { createApp } from './app'
import { getDescription, getTitle } from './utils'

import type { App } from 'vue'

// this fixes a warning which occurs when building
// > "resolveComponent" is imported from external module "vue" but never used in ...
// running this here fixes the warning and should not impact anything due to prerender setting.
resolveComponent('nothing')

async function render(pageContext: PageContextServer & PageContext) {
  const { app, i18n } = createApp(pageContext, false)

  const locale = i18n.global.locale.value

  const appHtml = await renderToString(app)

  // See https://vike.dev/head
  const title = getTitle(pageContext)
  const description = getDescription(pageContext)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${locale}">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <meta property="og:image" content="${META.BASE_URL}${image}" />
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="601"/>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  }
}

async function renderToString(app: App) {
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}

export default render
