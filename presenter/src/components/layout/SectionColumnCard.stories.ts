import SectionColumnCard from './SectionColumnCard.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Layout/SectionColumnCard',
  component: SectionColumnCard,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    // size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    cardTitle: 'Titel',
    cardText: 'Lorem Ipsum und so weiter Lorem Ipsum und so weiter Lorem Ipsum und so weiter',
  }, // default value
} satisfies Meta<typeof SectionColumnCard>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {},
}
