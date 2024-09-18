import { SBComp } from '#types/SBComp'

import EmailInput from './EmailInput.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Inputs/EmailInput',
  component: EmailInput as SBComp,
  tags: ['autodocs'],
} satisfies Meta<typeof EmailInput>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    modelValue: 'test@example.com',
    label: 'Email Input Field',
  },
}
