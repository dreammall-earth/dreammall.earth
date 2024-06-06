import { SBComp } from '#types/SBComp'
import ListElement from './ListElement.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'List/ListElement',
  component: ListElement as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: false },
      { title: 'Beispiel Titel 2', fullWidth: true },
      { title: 'Beispiel Titel 3', fullWidth: false },
      { title: 'Beispiel Titel 4', fullWidth: true },
    ],
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof ListElement>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: false },
      { title: 'Beispiel Titel 2', fullWidth: true },
      { title: 'Beispiel Titel 3', fullWidth: false },
      { title: 'Beispiel Titel 4', fullWidth: true },
    ],
  },
}

export const FullWidthItems: Story = {
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: true },
      { title: 'Beispiel Titel 2', fullWidth: true },
      { title: 'Beispiel Titel 3', fullWidth: true },
      { title: 'Beispiel Titel 4', fullWidth: true },
    ],
  },
}

export const NonFullWidthItems: Story = {
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: false },
      { title: 'Beispiel Titel 2', fullWidth: false },
      { title: 'Beispiel Titel 3', fullWidth: false },
      { title: 'Beispiel Titel 4', fullWidth: false },
    ],
  },
}
