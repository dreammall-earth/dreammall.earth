import { SBComp } from '#types/SBComp'

import AboutMe from './AboutMe.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/AboutMe',
  component: AboutMe as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    user: {
      name: 'John Doe',
      text: 'Pushing pixels and experiences in digital products',
      place: 'Berlin, Germany',
      work: 'Frontend Developer at Company XY',
      social: {
        linkedin: 'https://www.linkedin.com/in/johndoe',
        xing: 'https://www.xing.com/profile/John_Doe',
        x: 'https://www.x.com/johndoe',
      },
    },
  },
} satisfies Meta<typeof AboutMe>

export default meta
type Story = StoryObj<typeof meta>

export const Raw: Story = {
  args: {},
}
