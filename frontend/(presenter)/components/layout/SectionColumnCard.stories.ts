import CoffeeIcon from '#assets/img/coffee_icon.svg'
import MallIcon from '#assets/img/logo_mall.svg'
import ProjectsIcon from '#assets/img/menschen_projekte.svg'
import { SBComp } from '#types/SBComp'

import SectionColumnCard from './SectionColumnCard.vue'

import type { Meta, StoryObj } from '@storybook/vue3'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Layout/SectionColumnCard',
  component: SectionColumnCard as SBComp,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    // size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    cardTitle: 'Titel',
    cardText: 'Lorem Ipsum und so weiter Lorem Ipsum und so weiter Lorem Ipsum und so weiter',
    imageSrc: CoffeeIcon,
  }, // default value
} satisfies Meta<typeof SectionColumnCard>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Mall: Story = {
  args: {
    imageSrc: MallIcon,
  },
}

export const Coffee: Story = {
  args: {
    imageSrc: CoffeeIcon,
  },
}

export const Projects: Story = {
  args: {
    imageSrc: ProjectsIcon,
  },
}
