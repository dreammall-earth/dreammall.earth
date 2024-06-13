import { SBComp } from '#types/SBComp'

import CreateButton from './CreateButton.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Inputs/CreateButton',
  component: CreateButton as SBComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
  args: {}, // default value
} satisfies Meta<typeof CreateButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {},
}
