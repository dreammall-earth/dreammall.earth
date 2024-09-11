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

import SepaIban from '#components/sepa-iban/SepaIban.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { ACCOUNTING } from '#src/env'
import { useUserStore } from '#stores/userStore'

const userStore = useUserStore()
const { getCurrentUser } = storeToRefs(userStore)
</script>
