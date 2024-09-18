import Bell from './bell.svg?component'
import Camera from './camera.svg?component'
import Cockpit from './cockpit.svg?component'
import Discord from './discord.svg?component'
import Ellipsis from './ellipsis.svg?component'
import Logout from './logout.svg?component'
import Mall from './mall.svg?component'
import Message from './message.svg?component'
import Moon from './moon.svg?component'
import Sun from './sun.svg?component'
import Telegram from './telegram.svg?component'
import Tiktok from './tiktok.svg?component'
import WorldCafe from './worldCafe.svg?component'
import X from './x.svg?component'
import Xing from './xing.svg?component'

import type { IconAliases } from 'vuetify'

const aliases: Partial<IconAliases> = {
  bell: Bell,
  camera: Camera,
  cockpit: Cockpit,
  discord: Discord,
  ellipsis: Ellipsis,
  logout: Logout,
  mall: Mall,
  message: Message,
  moon: Moon,
  sun: Sun,
  telegram: Telegram,
  tiktok: Tiktok,
  'world-cafe': WorldCafe,
  x: X,
  xing: Xing,
}

export { aliases }
