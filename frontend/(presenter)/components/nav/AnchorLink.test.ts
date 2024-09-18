import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import AnchorLink from './AnchorLink.vue'

vi.mock('vike/client/router')
vi.mocked(navigate).mockResolvedValue()

describe('AnchorLink', () => {
  const Wrapper = () => {
    return mount(AnchorLink, {
      props: {
        label: 'AnchorLink',
        href: 'someAnchorOrUrl',
      },
    })
  }

  let wrapper: ReturnType<typeof Wrapper>

  beforeEach(() => {
    wrapper = Wrapper()
  })

  it('renders Node with href', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('click on button', () => {
    beforeEach(async () => {
      await wrapper.find('a').trigger('click')
    })

    it('calls navigate', () => {
      expect(navigate).toHaveBeenCalledWith('someAnchorOrUrl')
    })
  })
})
