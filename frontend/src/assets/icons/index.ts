import Cockpit from './cockpit.svg?component'
import Mall from './mall.svg?component'
import WorldCafe from './worldCafe.svg?component'

import type { IconAliases } from 'vuetify'

const aliases: Partial<IconAliases> = {
  mall: Mall,
  cockpit: Cockpit,
  'world-cafe': WorldCafe,
}

export { aliases }
