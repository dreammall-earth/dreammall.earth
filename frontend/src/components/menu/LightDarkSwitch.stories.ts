import { SBComp } from '#types/SBComp'

import LightDarkSwitch from './LightDarkSwitch.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Buttons/LightDarkSwitch',
  component: LightDarkSwitch as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof LightDarkSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
