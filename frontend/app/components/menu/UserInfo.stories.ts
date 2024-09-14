import { SBComp } from '#types/SBComp'

import UserInfo from './UserInfo.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/UserInfo',
  component: UserInfo as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof UserInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
