import { SBComp } from '#types/SBComp'

import BottomMenu from './BottomMenu.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'ORGANISMS/BottomMenu',
  component: BottomMenu as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    (story) => ({
      components: { story },
      template: '<div id="teleported"></div><story />',
    }),
  ],
} satisfies Meta<typeof BottomMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
