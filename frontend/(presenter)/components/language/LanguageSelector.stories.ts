import { SBComp } from '#types/SBComp'

import LanguageSelector from './LanguageSelector.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Language/LanguageSelector',
  component: LanguageSelector as SBComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {}, // default value
} satisfies Meta<typeof LanguageSelector>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
// export const Open: Story = {
//   args: {
//     variant: 'primary',
//     size: 'large',
//     label: 'Button',
//   },
// }

export const Closed: Story = {
  args: {},
}
