import { SBComp } from '#types/SBComp'

import Switch from './SwitchComponent.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Buttons/Switch',
  component: Switch as SBComp,
  tags: ['autodocs'],
  argTypes: {
    defaultState: {
      control: 'radio',
      options: ['left', 'right'],
    },
  },
  args: { label: 'Label' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { defaultState: 'left' },
}
