<template>
  <TableLayout :table-url="tableUrl" :error-message="errorMessage"></TableLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import TableLayout from '#components/table-layout/TableLayout.vue'
import { joinWelcomeTableQuery } from '#queries/joinWelcomeTableQuery'

const { t } = useI18n()

const errorMessage = ref<string | null>(null)
const tableUrl = ref<string | null>(null)

const { result: joinTableQueryResult, error: joinTableQueryError } = useQuery(
  joinWelcomeTableQuery,
  () => ({}),
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(joinTableQueryResult, (data: { joinTable: string }) => {
  if (!data.joinTable) return
  tableUrl.value = data.joinTable
  errorMessage.value = null
})

// eslint-disable-next-line promise/prefer-await-to-callbacks
watch(joinTableQueryError, (error) => {
  if (!error) return
  errorMessage.value = error.message
  tableUrl.value = null
  throw new Error(t('table.error'), error)
})
</script>
