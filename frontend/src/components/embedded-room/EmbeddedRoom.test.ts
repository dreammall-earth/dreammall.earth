import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import EmbeddedRoom from './EmbeddedRoom.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('EmbeddedRoom', () => {
  const testUrl = 'https://dreammall.earth'

  const Wrapper = () => {
    return mount(EmbeddedRoom, { props: { url: testUrl } })
  }
  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('shows iframe with correct url', () => {
    expect(wrapper.find('iframe').exists()).toBeTruthy()
    expect(wrapper.find('iframe').attributes('src')).toBe(testUrl)
  })

  it('does not show iframe when url is not provided', async () => {
    await wrapper.setProps({ url: null })
    expect(wrapper.find('iframe').exists()).toBeFalsy()
  })
})
