import { SBComp } from '#types/SBComp'

import MobileCreateButtonActions from './MobileCreateButtonActions.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Buttons/MobileCreateButtonActions',
  component: MobileCreateButtonActions as SBComp,
  tags: ['autodocs'],
  argTypes: { isVisible: { control: 'boolean' } },
  args: { isVisible: true },
} satisfies Meta<typeof MobileCreateButtonActions>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
