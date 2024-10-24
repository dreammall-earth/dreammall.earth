import { SBComp } from '#types/SBComp'

import HoverInfo from './HoverInfo.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Starmap/HoverInfo',
  component: HoverInfo as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof HoverInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    x: 100,
    y: 100,
    data: {
      id: 1,
      name: 'Marianne Müller',
    },
  },
}
