import { SBComp } from '#types/SBComp'

import DataPrivacyCheckbox from './DataPrivacyCheckbox.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Inputs/DataPrivacyCheckbox',
  component: DataPrivacyCheckbox as SBComp,
  tags: ['autodocs'],
} satisfies Meta<typeof DataPrivacyCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {}
