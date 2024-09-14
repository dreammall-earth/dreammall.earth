<template>
  <DefaultLayout>
    <SepaIban
      v-if="getCurrentUser"
      :account-data="ACCOUNTING"
      :reference="getCurrentUser.referenceId"
    ></SepaIban>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import SepaIban from '#app/components/sepa-iban/SepaIban.vue'
import DefaultLayout from '#app/layouts/DefaultLayout.vue'
import { useUserStore } from '#app/stores/userStore'
import { usePageContext } from '#renderer/context/usePageContext'

const pageContext = usePageContext()
const { ACCOUNTING } = pageContext.publicEnv

const userStore = useUserStore()
const { getCurrentUser } = storeToRefs(userStore)
</script>
