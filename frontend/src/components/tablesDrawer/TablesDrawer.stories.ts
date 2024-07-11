import { withApollo } from '#root/.storybook/withApollo.decorator.js'
import { SBComp } from '#types/SBComp'

import TablesDrawer from './TablesDrawer.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'tablesDrawer/TablesDrawer',
  component: TablesDrawer as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    modelValue: false,
  },
  parameters: {
    appHeight: '100vh',
  },
  decorators: [withApollo],
} satisfies Meta<typeof TablesDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    modelValue: true,
  },
}
