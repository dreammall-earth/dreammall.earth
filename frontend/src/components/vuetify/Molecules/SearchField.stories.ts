/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Meta, StoryFn } from '@storybook/vue3'

import SearchDrawerField from './SearchField.vue'

export default {
  title: 'Molecules/SearchField',
  component: SearchDrawerField,
} as Meta<typeof SearchDrawerField>

const Template: StoryFn<typeof SearchDrawerField> = (args) => ({
  components: { SearchDrawerField },
  setup() {
    return { args }
  },
  template: '<SearchDrawerField v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  label: 'Search',
  prependInnerIcon: 'mdi-tune',
}