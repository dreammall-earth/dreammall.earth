import { SBComp } from '#types/SBComp'

import AboutMe from './AboutMe.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/AboutMe',
  component: AboutMe as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    name: 'John Doe',
    initials: 'JD',
    introduction: 'Pushing pixels and experiences',
    availability: 'available',
    details: [
      { category: 'place', text: 'Berlin, Germany' },
      { category: 'place', text: 'Madrid, Spain' },
      { category: 'work', text: 'Frontend Developer at Company XY' },
      { category: 'language', text: 'English, German, Spanish' },
      { category: 'education', text: 'B.Sc. Computer Science' },
      { category: 'feeling', text: 'Happy like a really happy honey cake horse' },
    ],
    social: {
      linkedin: 'https://www.linkedin.com/in/johndoe',
      xing: 'https://www.xing.com/profile/John_Doe',
      x: 'https://www.x.com/johndoe',
    },
  },
} satisfies Meta<typeof AboutMe>

export default meta
type Story = StoryObj<typeof meta>

export const Raw: Story = {
  args: {},
}
