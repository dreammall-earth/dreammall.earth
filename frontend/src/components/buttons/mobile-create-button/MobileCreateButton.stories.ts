import { SBComp } from '#types/SBComp'

import MobileCreateButton from './MobileCreateButton.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Buttons/MobileCreateButton',
  component: MobileCreateButton as SBComp,
  tags: ['autodocs'],
  argTypes: { isActive: { control: 'boolean' } },
  args: { isActive: false },
} satisfies Meta<typeof MobileCreateButton>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
