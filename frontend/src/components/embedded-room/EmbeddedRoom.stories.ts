import { SBComp } from '#types/SBComp'

import EmbeddedRoom from './EmbeddedRoom.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'EmbeddedRoom',
  component: EmbeddedRoom as SBComp,
  tags: ['autodocs'],
  argTypes: { url: { control: 'text' } },
  args: { url: 'https://meet.jit.si/room' },
} satisfies Meta<typeof EmbeddedRoom>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
