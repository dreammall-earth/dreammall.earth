<template>
  <form
    class="d-flex flex-column align-center justify-space-around pa-4 w-100 h-100"
    @submit.prevent="onSubmit"
  >
    <StepHeader
      :title="$t('cockpit.myTables.changeModerators.title')"
      :is-back-button-visible="false"
      @close="$emit('close')"
    />
    <UserSelection v-model="userIds" />

    <SimpleButton
      type="submit"
      class="mt-12"
      :label="$t('cockpit.myTables.changeModerators.update')"
    />
  </form>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import SimpleButton from '#app/components/buttons/SimpleButton.vue'
import StepHeader from '#app/components/steps/StepHeader.vue'
import UserSelection from '#app/components/user-selection/UserSelection.vue'
import { useTablesStore, Table } from '#app/stores/tablesStore'

const props = defineProps<{
  tableId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const tablesStore = useTablesStore()

const { getTables: tables } = storeToRefs(tablesStore)

const userIds = ref(
  tables.value.find((table: Table) => table.id === props.tableId)?.users.map((user) => user.id) ??
    [],
)

const onSubmit = async (): Promise<void> => {
  await tablesStore.updateTableModerators(props.tableId, userIds.value)

  emit('close')
}
</script>
