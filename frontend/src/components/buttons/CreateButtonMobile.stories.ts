import { SBComp } from '#types/SBComp'

import CreateButtonMobile from './CreateButtonMobile.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Inputs/CreateButtonMobile',
  component: CreateButtonMobile as SBComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  args: {}, // default value
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div style="position: relative; height: 100vh; top: 25%;z-index: 10;"><div id="teleported"></div><story /></div>',
    }),
  ],
} satisfies Meta<typeof CreateButtonMobile>

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
