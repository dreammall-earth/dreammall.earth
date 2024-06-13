import { withApollo } from '#root/.storybook/withApollo.decorator'
import { SBComp } from '#types/SBComp'

import Page from './+Page.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Pages/Room',
  component: Page as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [withApollo],
} satisfies Meta<typeof Page>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
}
