import { ref } from 'vue'

import { SBComp } from '#types/SBComp'

import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'
import TopMenu from './TopMenu.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'ORGANISMS/TopMenu',
  component: TopMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '50vh',
  },
} satisfies Meta<typeof TopMenu>

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
      return { args: args as Record<string, unknown>, drawer, toggleDrawer }
    },
    template: `
      <div>
        <TopMenu @toggleDrawer="toggleDrawer" />
        <ListWithNavigationDrawer :drawer="drawer" @update:drawer="drawer = $event" />
      </div>
    `,
  }),
}
