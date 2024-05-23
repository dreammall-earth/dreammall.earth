import { SBComp } from '#types/SBComp'

import MessageIndicator from './MessageIndicator.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/MessageIndicator',
  component: MessageIndicator as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: { numberOfMessages: 3 },
} satisfies Meta<typeof MessageIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const WithMessages: Story = {
  args: { numberOfMessages: 3 },
}

export const WithoutMessages: Story = {
  args: { numberOfMessages: 0 },
}
