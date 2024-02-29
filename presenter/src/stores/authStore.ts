import { User } from 'oidc-client-ts'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)

    const accessToken = computed(() => user.value?.access_token ?? '')
    const isLoggedIn = computed(() => !!user.value)

    const save = (u: User) => {
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
  { persist: true},
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
