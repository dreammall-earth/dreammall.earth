import { SBComp } from '#types/SBComp'

import EmbeddedTable from './EmbeddedTable.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'EmbeddedTable',
  component: EmbeddedTable as SBComp,
  tags: ['autodocs'],
  argTypes: { url: { control: 'text' } },
  args: { url: 'https://meet.jit.si/table' },
} satisfies Meta<typeof EmbeddedTable>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
