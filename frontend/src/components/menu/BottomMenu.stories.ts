import { withApollo } from '#root/.storybook/withApollo.decorator.js'
import { SBComp } from '#types/SBComp'

import BottomMenu from './BottomMenu.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/BottomMenu',
  component: BottomMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [withApollo],
} satisfies Meta<typeof BottomMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
