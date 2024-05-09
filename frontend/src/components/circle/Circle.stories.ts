import { SBComp } from '#types/SBComp'

import Circle from './Circle.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Design/Circle',
  component: Circle as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
