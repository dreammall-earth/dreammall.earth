import { SBComp } from '#types/SBComp'

import CustomSelect from './CustomSelect.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/AboutMe/CustomSelect',
  component: CustomSelect as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof CustomSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Raw: Story = {
  args: {},
}
