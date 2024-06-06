import { SBComp } from '#types/SBComp'
import NavigationDrawer from './NavigationDrawer.vue'
import ListElement from './ListElement.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Navigation Drawer/NavigationDrawer',
  component: NavigationDrawer as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    appHeight: '100vh', // Specific height for NavigationDrawer story
  },
} satisfies Meta<typeof NavigationDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: (args) => ({
    components: { NavigationDrawer },
    setup() {
      return { args }
    },
    template: `
      <NavigationDrawer v-bind="args">
        <p>Ein beliebiger Inhalt</p>
      </NavigationDrawer>
    `,
  }),
}

export const WithListElement: Story = {
  render: (args) => ({
    components: { NavigationDrawer, ListElement },
    setup() {
      const items = [
        { title: 'Beispiel Titel 1', fullWidth: false },
        { title: 'Beispiel Titel 2', fullWidth: true },
        { title: 'Beispiel Titel 3', fullWidth: false },
        { title: 'Beispiel Titel 4', fullWidth: true },
      ]
      return { args, items }
    },
    template: `
      <NavigationDrawer v-bind="args">
        <ListElement :items="items" />
      </NavigationDrawer>
    `,
  }),
}
