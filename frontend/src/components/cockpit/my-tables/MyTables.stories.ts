import { SBComp } from '#types/SBComp'

import MyTables from './MyTables.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'cockpit/my-tables/MyTables',
  component: MyTables as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof MyTables>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
