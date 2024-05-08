import Bell from './bell.svg?component'
import Cockpit from './cockpit.svg?component'
import Mall from './mall.svg?component'
import Message from './message.svg?component'
import WorldCafe from './worldCafe.svg?component'

import type { IconAliases } from 'vuetify'

const aliases: Partial<IconAliases> = {
  bell: Bell,
  mall: Mall,
  cockpit: Cockpit,
  message: Message,
  'world-cafe': WorldCafe,
}

export { aliases }
