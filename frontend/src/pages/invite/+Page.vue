<template>
  <SimpleLayout v-if="codeError" class="d-flex flex-column align-center justify-center">
    <div class="message mb-4">
      <span v-if="codeError === 'invalid'">{{ $t('invite.invalidCode') }}</span>
      <span v-else-if="codeError === 'used'">{{ $t('invite.usedCode') }}</span>
    </div>
    <SimpleButton :label="$t('invite.register')" @click="signup" />
  </SimpleLayout>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount, ref, watch } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import { usePageContext } from '#context/usePageContext'
import SimpleLayout from '#layouts/SimpleLayout.vue'
import { validateInvitationLinkQuery } from '#queries/validateInvitationLinkQuery'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

const pageContext = usePageContext()

const code = ref(pageContext.routeParams?.code)

type CodeError = 'invalid' | 'used' | null

const codeError = ref<CodeError>(null)

watch(pageContext, (context) => {
  code.value = context.routeParams?.code
})

const { result: validateInvitationQueryResult, error } = useQuery(
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
  if (!data.validateInvitationLink) return
  localStorage.setItem('invitationCode', code.value.toString())
  authService?.signUp()
})

// eslint-disable-next-line promise/prefer-await-to-callbacks
watch(error, (error) => {
  if (!error) return
  switch (error.message) {
    case 'Link already used.':
      codeError.value = 'used'
      break
    case 'Invalid invitation code.':
      codeError.value = 'invalid'
      break
  }
})

onBeforeMount(async () => {
  if (authStore.isLoggedIn) {
    // Don't need to validate the code or sign up if the user is already logged in
    navigate('/')
  }
})

const signup = () => authService?.signUp()
</script>

<style scoped>
.message {
  color: #e5e5e5;
}
</style>
