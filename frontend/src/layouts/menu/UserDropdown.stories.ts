import { provide } from 'vue'

import { SBComp } from '#types/SBComp'

import UserDropdown from './UserDropdown.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Menu/UserDropdown',
  component: UserDropdown as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof UserDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: (args) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    components: { UserDropdown },
    setup() {
      provide('authService', {})

      return { args }
    },
    template: '<UserDropdown :prop-name="args.propName" />',
  }),
  args: {},
}
