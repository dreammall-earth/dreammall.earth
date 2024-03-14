import { PageContext } from 'vike/types'

// export const title = 'DreamMall | Newsletter'

export function title(pageContext: PageContext) {
  //   const title = pageContext.locale === 'de' ? 'DreamMall | Newsletter' : 'DreamMall | Newsletter'
  // eslint-disable-next-line no-console
  console.log('pageContext', pageContext)
  const title = 'DreamMall | Newsletter'
  return title
}
