import Cookies from 'js-cookie'
import { User } from 'oidc-client-ts'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const cookieStorage = {
  setItem(key: string, state: string) {
    Cookies.set('auth', state, { expires: 3 })
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
      save,
      clear,
    }
  },
  { persist: { storage: cookieStorage } },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
