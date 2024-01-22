import { SBComp } from '#types/SBComp'

import HeaderMenu from './HeaderMenu.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/HeaderMenu',
  component: HeaderMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof HeaderMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
