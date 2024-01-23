<template>
  <DefaultLayout>
    <div class="h-screen">
      <p v-if="isError">
        {{ $t('optin.error.text') }}
        <br />
        <a href="/#newsletter-section">{{ $t('optin.error.link') }}</a>
      </p>
      <p v-else>{{ $t('optin.success.text') }}</p>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { onBeforeMount, ref } from 'vue'

import { usePageContext } from '#context/usePageContext'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { confirmNewsletter } from '#mutations/confirmNewsletter'

const pageContext = usePageContext()

const code = pageContext.routeParams?.code
const isLoading = ref(false)
const isError = ref(false)

const { mutate: confirmNewsletterMutation } = useMutation<{ confirmNewsletter: boolean }>(
  confirmNewsletter,
)

onBeforeMount(async () => {
  isLoading.value = !isLoading.value
  try {
    const result = await confirmNewsletterMutation({ code })
    isError.value = !result?.data?.confirmNewsletter
  } catch (error) {
    isError.value = true
  }

  isLoading.value = !isLoading.value

  if (!isError.value) {
    setTimeout(() => {
      navigate('/')
    }, 5000)
  }
})
</script>

<style scoped lang="scss">
.h-screen {
  padding-top: 100px;
  padding-left: 100px;
}
</style>
