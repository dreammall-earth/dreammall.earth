import { SBComp } from '#types/SBComp'
import TopMenu from './TopMenu.vue'
import { ref } from 'vue'

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
    components: { TopMenu },
    setup() {
      const drawer = ref(false)
      const toggleDrawer = () => {
        drawer.value = !drawer.value
      }
      return { args, drawer, toggleDrawer }
    },
    template: `
      <div>
        <TopMenu @toggleDrawer="toggleDrawer" />
        <ListWithNavigationDrawer :drawer="drawer" @update:drawer="drawer = $event" />
      </div>
    `,
  }),
}
