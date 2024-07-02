import { SBComp } from '#types/SBComp'

import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'ORGANISMS/ListWithNavigationDrawer',
  component: ListWithNavigationDrawer as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    drawer: false,
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof ListWithNavigationDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    drawer: false,
  },
}
