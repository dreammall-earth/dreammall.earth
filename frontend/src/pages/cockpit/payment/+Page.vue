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

import { usePageContext } from '#renderer/context/usePageContext'
import SepaIban from '#src/components/sepa-iban/SepaIban.vue'
import DefaultLayout from '#src/layouts/DefaultLayout.vue'
import { useUserStore } from '#src/stores/userStore'

const pageContext = usePageContext()
const { ACCOUNTING } = pageContext.publicEnv

const userStore = useUserStore()
const { getCurrentUser } = storeToRefs(userStore)
</script>
