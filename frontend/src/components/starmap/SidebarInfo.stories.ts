import { SBComp } from '#types/SBComp'

import SidebarInfo from './SidebarInfo.vue'

import type { UserWithProfile } from '#stores/userStore'
import type { Meta, StoryObj } from '@storybook/vue3'

const profile: UserWithProfile = {
  id: 1,
  username: 'mockedUser',
  name: 'User',
  introduction: 'Hello, I am a mocked user',
  availability: 'available',
  details: [
    {
      id: 1,
      category: 'education',
      text: 'mockedText',
    },
  ],
  social: [
    {
      id: 1,
      type: 'discord',
      link: 'mockedLink',
    },
  ],
}

const meta = {
  title: 'Starmap/SidebarInfo',
  component: SidebarInfo as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof SidebarInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    profile,
  },
}
