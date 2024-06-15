import { SBComp } from '#types/SBComp'

import StarMap from './StarMap.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof StarMap> = {
  title: 'Components/StarMap',
  component: StarMap as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
