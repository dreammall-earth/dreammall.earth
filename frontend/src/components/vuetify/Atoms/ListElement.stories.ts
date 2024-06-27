// import { VIcon, VBtn, VAvatar, VImg } from 'vuetify/components'

import { SBComp } from '#types/SBComp'

import ListElement from './ListElement.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof ListElement> = {
  title: 'MOLECULES/ListElement',
  component: ListElement as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    items: [
      {
        meetingName: 'Beispiel Titel 1',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
        // rounded: true,
        // prepend: VIcon,
        // prependProps: { icon: 'mdi-home' },
        // append: VBtn,
        // appendProps: { icon: 'mdi-menu' },
      },
      {
        meetingName: 'Beispiel Titel 2',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
        // rounded: true,
        // prepend: VAvatar,
        // prependProps: { src: 'https://via.placeholder.com/40' },
        // append: VIcon,
        // appendProps: { icon: 'mdi-menu' },
      },
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
      {
        meetingName: 'Beispiel Titel 1',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
        // append: VBtn,
        // appendProps: { icon: 'mdi-menu' },
      },
      {
        meetingName: 'Beispiel Titel 2',
        meetingID: 'xxx',
        startTime: '1234',
        participantCount: 4,
        attendees: [],
        joinLink: 'https://my.link',
        // append: VIcon,
        // appendProps: { icon: 'mdi-menu' },
      },
    ],
  },
}

/*
export const WithIcons: Story = {
  args: {
    items: [
      {
        title: 'Home',
        prepend: VIcon,
        prependProps: { icon: 'mdi-home' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Profile',
        prepend: VIcon,
        prependProps: { icon: 'mdi-account' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Settings',
        prepend: VIcon,
        prependProps: { icon: 'mdi-settings' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Logout',
        prepend: VIcon,
        prependProps: { icon: 'mdi-logout' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
    ],
  },
}

export const WithImages: Story = {
  args: {
    items: [
      {
        title: 'Item 1',
        subtitle: 'Subtitle 1',
        prepend: VImg,
        prependProps: { src: 'https://via.placeholder.com/40' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Item 2',
        subtitle: 'Subtitle 2',
        prepend: VImg,
        prependProps: { src: 'https://via.placeholder.com/40' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Item 3',
        subtitle: 'Subtitle 3',
        prepend: VImg,
        prependProps: { src: 'https://via.placeholder.com/40' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
      {
        title: 'Item 4',
        subtitle: 'Subtitle 4',
        prepend: VImg,
        prependProps: { src: 'https://via.placeholder.com/40' },
        append: VIcon,
        appendProps: { icon: 'mdi-menu' },
      },
    ],
  },
}
*/
