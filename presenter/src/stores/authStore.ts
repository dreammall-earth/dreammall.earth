import { User } from 'oidc-client-ts'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref<User | null>(null)

  const accessToken = computed(() => authUser.value?.access_token ?? '')

  const isLoggedIn = computed(() => !!authUser.value)

  const save = (user: User) => {
    authUser.value = user
  }

  const clear = () => {
    authUser.value = null
  }

  return {
    accessToken,
    isLoggedIn,
    save,
    clear,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
