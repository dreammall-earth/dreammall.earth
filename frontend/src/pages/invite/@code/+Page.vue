<template>
  <div>
    <div v-if="isValidCode === false">Code invalid, but you can register here:...</div>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount, ref, watch } from 'vue'

import { usePageContext } from '#context/usePageContext'
import { validateInvitationLinkQuery } from '#queries/validateInvitationLinkQuery'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

const pageContext = usePageContext()

const code = ref(Number(pageContext.routeParams?.code))

const isValidCode = ref<boolean | undefined>()

watch(pageContext, (context) => {
  code.value = Number(context.routeParams?.id)
})

const { result: validateInvitationQueryResult } = useQuery(
  validateInvitationLinkQuery,
  () => ({
    code: code.value,
  }),
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(validateInvitationQueryResult, (data: { validateInvitationLink: boolean }) => {
  if (!data.validateInvitationLink) {
    isValidCode.value = false
    return
  }
  localStorage.setItem('invitationCode', code.value.toString())
  isValidCode.value = true
  authService?.signUp()
})

onBeforeMount(async () => {
  if (authStore.isLoggedIn) {
    // Don't need to validate the code or sign up if the user is already logged in
    navigate('/')
  }
})
</script>
