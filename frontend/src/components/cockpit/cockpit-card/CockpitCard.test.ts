import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CockpitCard from './CockpitCard.vue'

describe('CockpitCard', () => {
  const Wrapper = ({
    narrow = false,
    headerSlot = '<h2>Header</h2>',
    defaultSlot = '<div>Content</div>',
  } = {}) =>
    mount(CockpitCard, { props: { narrow }, slots: { default: defaultSlot, header: headerSlot } })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders narrow', () => {
    const wrapper = Wrapper({ narrow: true })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders with empty header slot', () => {
    const wrapper = Wrapper({ headerSlot: undefined })
    expect(wrapper.element).toMatchSnapshot()
  })
})
