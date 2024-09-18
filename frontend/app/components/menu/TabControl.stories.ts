import { SBComp } from '#types/SBComp'

import TabControl from './TabControl.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/TabControl',
  component: TabControl as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof TabControl>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
