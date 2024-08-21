import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { UserDetail } from '#stores/userStore'

import UserDetails from './UserDetails.vue'

describe('UserDetails', () => {
  const Wrapper = ({
    details = [
      { id: 1, category: 'education', text: 'I am a student' },
      { id: 2, category: 'work', text: 'I am a worker' },
      { id: 3, category: 'work', text: 'I really like my job' },
      { id: 4, category: 'language', text: 'English' },
      { id: 5, category: 'place', text: 'Berlin' },
      { id: 6, category: 'feeling', text: 'Yeah!' },
    ] as UserDetail[],
    editable = false,
  } = {}) => mount(UserDetails, { props: { details, editable } })

  it('renders in non-editable mode', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders in editable mode', () => {
    const wrapper = Wrapper({ editable: true })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders placeholders', () => {
    const wrapper = Wrapper({ details: [] })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders placeholders in editable mode', () => {
    const wrapper = Wrapper({ details: [], editable: true })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('emits remove-details event', async () => {
    const wrapper = Wrapper({ editable: true })
    await wrapper.find('.detail').find('button').trigger('click')
    expect(wrapper.emitted('remove-detail')).toEqual([[1]])
  })
})
