import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SepaIban from './SepaIban.vue'

describe('SepaIban', () => {
  const props = {
    reference: 'REFEREN',
    accountData: {
      ACCOUNT_HOLDER: 'Mustermann GmbH, Max Mustermann',
      ACCOUNT_HOLDER_ADDRESS: 'Musterstraße 10, 12345 Musterstadt',
      IBAN: 'DE75512108001245126199',
      BIC: 'SOGEDEFFXXX',
      BANK: 'Société Générale',
    },
  }
  const global = {
    stubs: {
      VueQrcode: true,
    },
  }
  const opts = { props, global }

  describe('renders account data so that the user can make a bank transfer', () => {
    describe('in read only input text fields', () => {
      it('contains account holder and inserts new lines for a comma', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('textarea#input-0').element as HTMLInputElement).value).toBe(
          'Mustermann GmbH\nMax Mustermann',
        )
      })

      it('contains account holder address, if given', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('textarea#input-2').element as HTMLInputElement).value).toBe(
          'Musterstraße 10\n12345 Musterstadt',
        )
      })

      it('contains IBAN', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('input#input-4').element as HTMLInputElement).value).toBe(
          'DE75512108001245126199',
        )
      })

      it('contains BIC', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('input#input-6').element as HTMLInputElement).value).toBe(
          'SOGEDEFFXXX',
        )
      })

      it('contains bank name', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('input#input-8').element as HTMLInputElement).value).toBe(
          'Société Générale',
        )
      })

      it('contains transfer purpose', () => {
        const wrapper = mount(SepaIban, opts)
        expect((wrapper.find('input#input-10').element as HTMLInputElement).value).toBe('REFEREN')
      })
    })

    it('as a QR code', () => {
      const wrapper = mount(SepaIban, opts)
      const value =
        'BCD\n002\n1\nSCT\n\nMustermann GmbH, Max Mustermann\nDE75512108001245126199\nEUR22.90\n\n\nREFEREN\n'
      expect(wrapper.getComponent({ name: 'vue-qrcode' }).props('value')).toEqual(value)
    })
  })
})
