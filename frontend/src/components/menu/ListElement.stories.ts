import { SBComp } from '#types/SBComp'
import ListElement from './ListElement.vue'
import { VIcon, VBtn, VAvatar } from 'vuetify/components'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'List/ListElement',
  component: ListElement as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: false, rightContent: VBtn, rounded: true },
      { title: 'Beispiel Titel 2', fullWidth: true, rightContent: VIcon, rounded: true },
      { title: 'Beispiel Titel 3', fullWidth: false, rightContent: VAvatar, rounded: true },
      { title: 'Beispiel Titel 4', fullWidth: true, rightContent: VIcon, rounded: true },
    ],
  },
  parameters: {
    appHeight: '100vh',
  },
} satisfies Meta<typeof ListElement>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    items: [
      { title: 'Beispiel Titel 1', fullWidth: false, rightContent: VBtn },
      { title: 'Beispiel Titel 2', fullWidth: true, rightContent: VIcon },
      { title: 'Beispiel Titel 3', fullWidth: false, rightContent: VAvatar },
      { title: 'Beispiel Titel 4', fullWidth: true, rightContent: VIcon },
    ],
  },
}

export const WithIcons: Story = {
  args: {
    items: [
      { title: 'Home', fullWidth: false, icon: 'mdi-home', rightContent: VIcon, rightContentProps: { icon: 'mdi-home' } },
      { title: 'Profile', fullWidth: true, icon: 'mdi-account', rightContent: VIcon, rightContentProps: { icon: 'mdi-account' } },
      { title: 'Settings', fullWidth: false, icon: 'mdi-settings', rightContent: VIcon, rightContentProps: { icon: 'mdi-settings' } },
      { title: 'Logout', fullWidth: true, icon: 'mdi-logout', rightContent: VIcon, rightContentProps: { icon: 'mdi-logout' } },
    ],
  },
}

export const WithImages: Story = {
  args: {
    items: [
      { title: 'Item 1', subtitle: 'Subtitle 1', fullWidth: false, image: 'https://via.placeholder.com/40', rightContent: VAvatar, rightContentProps: { src: 'https://via.placeholder.com/40' } },
      { title: 'Item 2', subtitle: 'Subtitle 2', fullWidth: true, image: 'https://via.placeholder.com/40', rightContent: VAvatar, rightContentProps: { src: 'https://via.placeholder.com/40' } },
      { title: 'Item 3', subtitle: 'Subtitle 3', fullWidth: false, image: 'https://via.placeholder.com/40', rightContent: VAvatar, rightContentProps: { src: 'https://via.placeholder.com/40' } },
      { title: 'Item 4', subtitle: 'Subtitle 4', fullWidth: true, image: 'https://via.placeholder.com/40', rightContent: VAvatar, rightContentProps: { src: 'https://via.placeholder.com/40' } },
    ],
  },
}
