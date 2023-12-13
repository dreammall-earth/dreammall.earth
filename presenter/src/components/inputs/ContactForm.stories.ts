import ContactForm from './ContactForm.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Inputs/ContactForm',
  component: ContactForm,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    // onClick: { action: 'clicked' },
  },
  args: {
    // inputLabel: 'input',
    // buttonLabel: 'button'
  }, // default value
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Example: Story = {
  args: {
    // inputLabel: 'E-Mail Address',
    // buttonLabel: 'Submit',
  },
}
