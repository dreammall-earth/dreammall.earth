import { SBComp } from '#types/SBComp'

import ListElement from './OpenTable.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'tablesDrawer/OpenTable',
  component: ListElement as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    items: [
      {
        meetingName: 'Beispiel Titel 1',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
      },
      {
        meetingName: 'Beispiel Titel 2',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
      },
    ],
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof ListElement>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    items: [
      {
        meetingName: 'Beispiel Titel 1',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
      },
      {
        meetingName: 'Beispiel Titel 2',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
      },
    ],
  },
}
