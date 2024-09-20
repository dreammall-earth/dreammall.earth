<template>
  <TableLayout :use-query-result="useQueryResult"></TableLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'

import TableLayout from '#components/table-layout/TableLayout.vue'
import { joinWelcomeTableQuery } from '#queries/joinWelcomeTableQuery'

const useQueryResult = useQuery(joinWelcomeTableQuery, () => ({}), {
  prefetch: false,
  fetchPolicy: 'no-cache',
})
</script>
