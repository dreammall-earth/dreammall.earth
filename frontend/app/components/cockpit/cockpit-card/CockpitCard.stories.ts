import { SBComp } from '#types/SBComp'

import CockpitCard from './CockpitCard.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

const meta = {
  title: 'Cockpit/CockpitCard',
  component: CockpitCard as SBComp,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof CockpitCard>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    components: { CockpitCard },
    template:
      '<CockpitCard><template #header><h2>Test</h2></template><div>Some test content... </div></CockpitCard>',
  }),
}
