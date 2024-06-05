import { SBComp } from '#types/SBComp'
import RoomMenu from './RoomMenu.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Navigation Drawer/RoomMenu',
  component: RoomMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '100vh', // Specific height for RoomMenu story
  },
} satisfies Meta<typeof RoomMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}