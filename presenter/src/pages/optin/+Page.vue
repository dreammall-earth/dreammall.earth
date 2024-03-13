<template>
  <DefaultLayout>
    <div class="h-screen optin-page py-12">
      <div v-if="isError">
        <p class="px-11">{{ $t('optin.error.text') }}</p>
        <MainButton
          class="mt-8 ml-11"
          :label="$t('optin.error.link')"
          size="auto"
          variant="primary"
          href="/#newsletter-section"
          >{{ $t('optin.error.link') }}</MainButton
        >
      </div>
      <div v-else>
        <p class="px-11">{{ $t('optin.success.text') }}</p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { onBeforeMount, ref } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
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
.optin-page {
  display: flex;
  justify-content: center;

  p {
    display: flex;
    font-size: 1.5em;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
  }
}
</style>
