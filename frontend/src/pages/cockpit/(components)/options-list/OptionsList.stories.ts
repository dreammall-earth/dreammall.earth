import { h } from 'vue'

import { SBComp } from '#types/SBComp'

import OptionButton from './OptionButton.vue'
import OptionsList from './OptionsList.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'cockpit/options-list/OptionsList',
  component: OptionsList as SBComp,
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: 'boolean',
      default: true,
    },
  },
  args: {},
  parameters: {
    appHeight: '100vh',
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="height: 60px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof OptionsList>

export default meta
type Story = StoryObj<typeof meta>

export const ExampleWith2: Story = {
  args: {
    isVisible: true,
    default: [h(OptionButton, 'Action 1'), h(OptionButton, 'Action 2')],
  },
}

export const ExampleWith3: Story = {
  args: {
    isVisible: true,
    default: [
      h(OptionButton, 'Action 1'),
      h(OptionButton, 'Action 2'),
      h(OptionButton, 'Action 3'),
    ],
  },
}

export const ExampleWith4: Story = {
  args: {
    isVisible: true,
    default: [
      h(OptionButton, 'Action 1'),
      h(OptionButton, 'Action 2'),
      h(OptionButton, 'Action 3'),
      h(OptionButton, 'Action 4'),
    ],
  },
}
