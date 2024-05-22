import Bell from './bell.svg?component'
import Camera from './camera.svg?component'
import Cockpit from './cockpit.svg?component'
import Ellipsis from './ellipsis.svg?component'
import Mall from './mall.svg?component'
import Message from './message.svg?component'
import WorldCafe from './worldCafe.svg?component'

import type { IconAliases } from 'vuetify'

const aliases: Partial<IconAliases> = {
  bell: Bell,
  camera: Camera,
  cockpit: Cockpit,
  ellipsis: Ellipsis,
  mall: Mall,
  message: Message,
  'world-cafe': WorldCafe,
}

export { aliases }
