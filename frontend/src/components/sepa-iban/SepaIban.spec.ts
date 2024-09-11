import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SepaIban from './SepaIban.vue'

describe('SepaIban', () => {
  const props = {
    reference: 'REFEREN',
    accountData: {
      ACCOUNT_HOLDER: 'Max Mustermann',
      IBAN: 'DE75512108001245126199',
      BIC: 'SOGEDEFFXXX',
    },
  }
  const global = {
    stubs: {
      VueQrcode: true,
    },
  }
  const opts = { props, global }

  describe('renders account data so that the user can make a bank transfer', () => {
    it('as text', () => {
      const wrapper = mount(SepaIban, opts)
      expect(wrapper.text()).toContain('Max Mustermann')
      expect(wrapper.text()).toContain('SOGEDEFFXXX')
      expect(wrapper.text()).toContain('REFEREN')
      expect(wrapper.text()).toContain('DE75512108001245126199')
    })

    it('as a QR code', () => {
      const wrapper = mount(SepaIban, opts)
      const value =
        'BCD\n002\n1\nSCT\n\nMax Mustermann\nDE75512108001245126199\nEUR30.00\n\n\nREFEREN\n'
      expect(wrapper.getComponent({ name: 'vue-qrcode' }).props('value')).toEqual(value)
    })

    describe('when the user updates the amount', () => {
      it('updates the QR code', async () => {
        const wrapper = mount(SepaIban, opts)
        await wrapper.find('input[type="number"]').setValue(42)
        const value =
          'BCD\n002\n1\nSCT\n\nMax Mustermann\nDE75512108001245126199\nEUR42.00\n\n\nREFEREN\n'
        expect(wrapper.getComponent({ name: 'vue-qrcode' }).props('value')).toEqual(value)
      })
    })
  })
})
