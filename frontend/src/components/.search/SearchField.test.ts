import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import SearchField from './SearchField.vue'
import { h } from 'vue'
import { VApp } from 'vuetify/components'

 
describe('SearchField', () => {
    const Wrapper = () => {
      return mount(VApp, {
        slots: {
          default: h(SearchField),
        },
      })
    }
  
    let wrapper: ReturnType<typeof Wrapper>
  
    beforeEach(() => {
      wrapper = Wrapper()
    })
  
    it('renders', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })