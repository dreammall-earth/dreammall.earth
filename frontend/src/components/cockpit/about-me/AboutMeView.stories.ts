import { SBComp } from '#types/SBComp'

import AboutMeView from './AboutMeView.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/AboutMe/AboutMeView',
  component: AboutMeView as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    name: 'John Doe',
    username: 'john23',
    initials: 'JD',
    introduction: 'Pushing pixels and experiences',
    availability: 'available',
    details: [
      { id: 1, category: 'place', text: 'Berlin, Germany' },
      { id: 2, category: 'place', text: 'Madrid, Spain' },
      { id: 3, category: 'work', text: 'Frontend Developer at Company XY' },
      { id: 4, category: 'language', text: 'English, German, Spanish' },
      { id: 5, category: 'education', text: 'B.Sc. Computer Science' },
      { id: 6, category: 'feeling', text: 'Happy like a really happy honey cake horse' },
    ],
    social: [
      {
        id: 1,
        type: 'linkedin',
        link: 'https://www.linkedin.com/in/johndoe',
      },
      {
        id: 2,
        type: 'xing',
        link: 'https://www.xing.com/profile/John_Doe',
      },
      {
        id: 3,
        type: 'x',
        link: 'https://www.x.com/johndoe',
      },
    ],
  },
} satisfies Meta<typeof AboutMeView>

export default meta
type Story = StoryObj<typeof meta>

export const Raw: Story = {
  args: {},
}
