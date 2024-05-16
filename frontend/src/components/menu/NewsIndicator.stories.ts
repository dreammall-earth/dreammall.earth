import { SBComp } from '#types/SBComp'

import NewsIndicator from './NewsIndicator.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/NewsIndicator',
  component: NewsIndicator as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: { hasNews: true },
} satisfies Meta<typeof NewsIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const WithNews: Story = {
  args: { hasNews: true },
}

export const WithoutNews: Story = {
  args: { hasNews: false },
}
