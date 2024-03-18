import { defineStore } from 'pinia'

import i18n from '#plugins/i18n'

export const useLocaleStore = defineStore('locale', {
  state: () => ({ locale: 'de' }),
  actions: {
    save(l: 'de' | 'en') {
      this.locale = l
      i18n.global.locale.value = l
    },
    clear() {
      this.locale = 'de'
      i18n.global.locale.value = 'de'
    },
  },
  persist: true,
})
