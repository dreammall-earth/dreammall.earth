import { ref } from 'vue'

import { SBComp } from '#types/SBComp'

import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'
import TopMenu from './TopMenu.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const meta: Meta<typeof TopMenu> = {
  title: 'ORGANISMS/TopMenu',
  component: TopMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '50vh',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: (args) => ({
    components: { TopMenu, ListWithNavigationDrawer },
    setup() {
      const drawer = ref<boolean>(false)
      const toggleDrawer = () => {
        drawer.value = !drawer.value
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const argTypes = args as { [key: string]: unknown }
      return { args: argTypes, drawer, toggleDrawer }
    },
    template: `
      <div>
        <TopMenu @toggleDrawer="toggleDrawer" />
        <ListWithNavigationDrawer :drawer="drawer" @update:drawer="drawer = $event" />
      </div>
    `,
  }),
}
