import { SBComp } from '#types/SBComp'

import TableList from './TableList.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'tablesDrawer/TableList',
  component: TableList as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    list: {
      type: 'mallTalk',
      heading: 'Mall Talk',
      items: [
        {
          id: 69,
          meetingName: 'Beispiel Titel 1',
          meetingID: 'xxx',
          startTime: '1234',
          type: 'MALL_TALK',
          isModerator: false,
          participantCount: 4,
          attendees: [
            { fullName: 'John Doe' },
            { fullName: 'Max Mustermann' },
            { fullName: 'Jane Doe' },
            { fullName: 'Elfriede Müller' },
          ],
        },
        {
          id: 77,
          meetingName: 'Beispiel Titel 2',
          meetingID: 'xxx',
          startTime: '1234',
          type: 'MALL_TALK',
          isModerator: true,
          participantCount: 0,
          attendees: [],
        },
      ],
    },
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof TableList>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    items: [
      {
        id: 69,
        meetingName: 'Beispiel Titel 1',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
      },
      {
        id: 77,
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
