import { Meta, StoryFn } from '@storybook/vue3'

import SearchDrawerField from './SearchField.vue'

export default {
  title: 'Components/SearchField',
  component: SearchDrawerField,
} as Meta<typeof SearchDrawerField>

const Template: StoryFn<typeof SearchDrawerField> = (args: any) => ({
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
