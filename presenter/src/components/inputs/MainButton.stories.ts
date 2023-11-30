import MainButton from './MainButton.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Inputs/MainButton',
  component: MainButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'third', 'third-inverse'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    onClick: { action: 'clicked' },
  },
  args: { variant: "primary", size: "large"}, // default value
} satisfies Meta<typeof MainButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "large",
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: 'Button',
  },
}

export const Third: Story = {
  args: {
    variant: "third",
    label: 'Button',
  },
}

export const ThirdInverse: Story = {
  args: {
    variant: "third-inverse",
    label: 'Button',
  },
}

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'large',
  },
}

export const Small: Story = {
  args: {
    label: 'Button',
    size: 'small',
  },
}
