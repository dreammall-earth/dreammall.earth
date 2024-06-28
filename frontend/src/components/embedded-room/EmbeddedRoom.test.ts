import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'

import EmbeddedRoom from './EmbeddedRoom.vue'

describe('EmbeddedRoom', () => {
  const testUrl = 'https://cafe.dreammall.earth/joinlink'

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
    expect(wrapper.find('iframe').exists()).toBe(true)
    expect(wrapper.find('iframe').attributes('src')).toBe(testUrl)
  })

  it('does not show iframe when url is not provided', async () => {
    await wrapper.setProps({ url: null })
    expect(wrapper.find('iframe').exists()).toBe(false)
  })

  describe('when url is changed to home page', () => {
    beforeEach(async () => {
      wrapper = Wrapper()
      const iframe = wrapper.find('iframe').element as HTMLIFrameElement
      iframe.src = 'https://cafe.dreammall.earth/joinlink'
      iframe.src = 'https://cafe.dreammall.earth'
      const event = new Event('load')
      Object.defineProperty(event, 'target', { value: iframe, enumerable: true })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      await (wrapper.vm as any).onRedirect(event)
    })

    it('hide iframe', async () => {
      await wrapper.vm.$nextTick(() => {
        expect(wrapper.find('iframe').exists()).toBe(false)
      })
    })

    it('emits close event', async () => {
      await wrapper.vm.$nextTick(() => {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
  })

  describe('when url is changed to another page', () => {
    beforeEach(async () => {
      wrapper = Wrapper()
      const iframe = wrapper.find('iframe').element as HTMLIFrameElement
      iframe.src = 'https://cafe.dreammall.earth/joinlink'
      iframe.src = 'https://cafe.dreammall.earth/rooms/1'
      const event = new Event('load')
      Object.defineProperty(event, 'target', { value: iframe, enumerable: true })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      await (wrapper.vm as any).onRedirect(event)
    })

    it('show iframe with new url', async () => {
      await wrapper.vm.$nextTick(() => {
        expect(wrapper.find('iframe').attributes('src')).toBe(
          'https://cafe.dreammall.earth/rooms/1',
        )
      })
    })

    it('does not emit close event', async () => {
      await wrapper.vm.$nextTick(() => {
        expect(wrapper.emitted().closed).toBeFalsy()
      })
    })
  })
})
