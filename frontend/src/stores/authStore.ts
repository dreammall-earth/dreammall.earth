import Cookies from 'js-cookie'
import { User } from 'oidc-client-ts'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { AUTH } from '#src/env.js'

export const cookieStorage = {
  setItem(key: string, state: string) {
    Cookies.set('auth', state, {
      expires: 3,
      Secure: true,
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(key: string) {
    return Cookies.get('auth') || null
  },
} as Storage

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)

    const accessToken = computed(() => user.value?.access_token ?? '')
    const isLoggedIn = computed(() => !!user.value)

    const isAdmin = computed(() =>
      user.value?.profile.groups
        ? (user.value?.profile.groups as string[]).includes(AUTH.ADMIN_GROUP)
        : false,
    )

    const save = (u: User | null) => {
      user.value = u
    }

    const clear = () => {
      user.value = null
    }

    return {
      user,
      accessToken,
      isLoggedIn,
      isAdmin,
      save,
      clear,
    }
  },
  { persist: { storage: cookieStorage } },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
