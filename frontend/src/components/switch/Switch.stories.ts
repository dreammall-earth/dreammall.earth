import { SBComp } from '#types/SBComp'

import Switch from './Switch.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Buttons/Switch',
  component: Switch as SBComp,
  tags: ['autodocs'],
  argTypes: { defaultState: { control: { type: 'select', options: ['left', 'right'] } } },
  args: { defaultState: 'left' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { defaultState: 'left' },
}
