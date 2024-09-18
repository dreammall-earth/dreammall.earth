import { SBComp } from '#types/SBComp'

import NameInput from './NameInput.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Inputs/NameInput',
  component: NameInput as SBComp,
  tags: ['autodocs'],
} satisfies Meta<typeof NameInput>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    modelValue: 'Example Name',
    label: 'Name Input Field',
  },
}
