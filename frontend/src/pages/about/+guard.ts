import { render } from 'vike/abort'

import type { GuardAsync } from 'vike/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  throw render(401, 'This page is forbidden.')
}

export { guard }
