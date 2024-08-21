import { SBComp } from '#types/SBComp'

import Table from './Table.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'cockpit/my-tables/Table',
  component: Table as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    id: 69,
    name: 'Harfenbau Deluxe',
    memberCount: 8,
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    args: {
      id: 69,
      name: 'Harfenbau Deluxe',
      memberCount: 8,
    },
  },
}
