import { mount } from '@vue/test-utils'
import { navigate } from 'vike/client/router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h, reactive, nextTick } from 'vue'
import { VApp } from 'vuetify/components'

import { usePageContext } from '#context/usePageContext'

import TabControl from './TabControl.vue'

import type { PageContext } from 'vike/types'

vi.mock('#context/usePageContext', () => ({
  usePageContext: vi.fn(),
}))

vi.mock('vike/client/router', () => ({
  navigate: vi.fn(),
}))

describe('TabControl', () => {
  let wrapper: ReturnType<typeof mount>
  const mockedUsePageContext = vi.mocked(usePageContext)
  const mockedNavigate = vi.mocked(navigate)

  const Wrapper = () => {
    return mount(VApp, {
      slots: {
        default: h(TabControl),
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rendert korrekt', async () => {
    const pageContextMock = reactive<Partial<PageContext>>({
      urlPathname: '/',
    })
    mockedUsePageContext.mockReturnValue(pageContextMock as PageContext)
    wrapper = Wrapper()
    await nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('Setzt aktives Element basierend auf der Route', () => {
    it('setzt das erste Element als aktiv für /', async () => {
      const pageContextMock = reactive<Partial<PageContext>>({
        urlPathname: '/',
      })
      mockedUsePageContext.mockReturnValue(pageContextMock as PageContext)
      wrapper = Wrapper()
      await nextTick()
      expect(wrapper.findAll('a.item')[0].classes()).toContain('active')
    })

    it('setzt das zweite Element als aktiv für /cockpit', async () => {
      const pageContextMock = reactive<Partial<PageContext>>({
        urlPathname: '/cockpit',
      })
      mockedUsePageContext.mockReturnValue(pageContextMock as PageContext)
      wrapper = Wrapper()
      await nextTick()
      expect(wrapper.findAll('a.item')[1].classes()).toContain('active')
    })
  })

  describe('Navigation beim Klicken auf ein Element', () => {
    it('navigiert zu /cockpit, wenn das zweite Element angeklickt wird', async () => {
      const pageContextMock = reactive<Partial<PageContext>>({
        urlPathname: '/',
      })
      mockedUsePageContext.mockReturnValue(pageContextMock as PageContext)
      wrapper = Wrapper()
      await wrapper.findAll('a.item')[1].trigger('click')
      expect(mockedNavigate).toHaveBeenCalledWith('/cockpit')
    })
  })
})
