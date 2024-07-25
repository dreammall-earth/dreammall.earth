import { User } from 'oidc-client-ts'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { usePageContext } from '#context/usePageContext.js'
import { AUTH } from '#src/env'

import { cookieStorage } from './cookieStorage'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // const pageContext = usePageContext()
    // const serverSideCookie = pageContext.headers && pageContext.headers.cookie

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
  {
    persist: {
      storage: cookieStorage,
      afterRestore: (ctx) => {
        console.log(`just restored '${ctx.store.$id}' with ${JSON.stringify(ctx.store.$state)}`)
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
