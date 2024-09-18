import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import Switch from './SwitchComponent.vue'

describe('Switch', () => {
  const Wrapper = () => {
    return mount(Switch)
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders label', async () => {
    await wrapper.setProps({ label: 'label' })

    expect(wrapper.find('span').text()).toBe('label')
  })

  describe('click switch', () => {
    let stateBefore: string

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      stateBefore = (wrapper.vm as any).state
      await wrapper.find('button').trigger('click')
    })

    it('emits change', () => {
      expect(wrapper.emitted('change')).toEqual([['right']])
    })

    it('changes state when clicked', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      expect((wrapper.vm as any).state).not.toBe(stateBefore)
    })
  })
})
