import {
  VList,
  VListItem,
  VListItemTitle,
  VBtn,
  VIcon,
  VCard,
  VCardText,
  VCardActions,
  VTextField,
} from 'vuetify/components'

import { SBComp } from '#types/SBComp'

import NavigationDrawer from './NavigationDrawer.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof NavigationDrawer> = {
  title: 'ORGANISMS/NavigationDrawer',
  component: NavigationDrawer as SBComp,
  tags: ['autodocs'],
  argTypes: {
    location: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Position of the drawer',
    },
  },
  args: {
    location: 'left',
  },
  parameters: {
    appHeight: '100vh',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: (args: Record<string, unknown>) => ({
    components: { NavigationDrawer, VList, VListItem, VListItemTitle, VBtn, VIcon },
    setup() {
      return { args }
    },
    template: `
      <NavigationDrawer v-bind="args">
        <VList>
          <VListItem>
            <VListItemTitle>Home</VListItemTitle>
            <VIcon>mdi-home</VIcon>
          </VListItem>
          <VListItem>
            <VListItemTitle>Profile</VListItemTitle>
            <VIcon>mdi-account</VIcon>
          </VListItem>
          <VListItem>
            <VListItemTitle>Settings</VListItemTitle>
            <VIcon>mdi-settings</VIcon>
          </VListItem>
          <VListItem>
            <VListItemTitle>Logout</VListItemTitle>
            <VIcon>mdi-logout</VIcon>
          </VListItem>
        </VList>
        <VBtn color="primary" class="mt-4">Click Me</VBtn>
      </NavigationDrawer>
    `,
  }),
}

export const WithTextAndButton: Story = {
  render: (args: Record<string, unknown>) => ({
    components: { NavigationDrawer, VCard, VCardText, VCardActions, VTextField, VBtn },
    setup() {
      return { args }
    },
    template: `
      <NavigationDrawer v-bind="args">
        <VCard>
          <VCardText>
            <p>This is an example text inside the Navigation Drawer.</p>
            <VTextField label="Input something" />
          </VCardText>
          <VCardActions>
            <VBtn color="primary">Submit</VBtn>
            <VBtn text>Cancel</VBtn>
          </VCardActions>
        </VCard>
      </NavigationDrawer>
    `,
  }),
}
