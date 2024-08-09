import { SBComp } from '#types/SBComp'

import AboutMe from './AboutMe.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/AboutMe',
  component: AboutMe as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AboutMe>

export default meta
type Story = StoryObj<typeof meta>

export const Raw: Story = {
  args: {},
}
