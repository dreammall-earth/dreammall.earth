<template>
  <form
    class="d-flex flex-column align-center justify-space-around pa-4 w-100 h-100"
    @submit.prevent="onSubmit"
  >
    <StepHeader
      :title="$t('cockpit.myTables.editTable.title')"
      :is-back-button-visible="false"
      @close="$emit('close')"
    />
    <v-text-field
      v-model="tableSettings.name"
      flat
      rounded
      class="elevation-0 w-75 flex-grow-0"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="mdi-pencil"
      maxlength="64"
      required
      autofocus
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch v-model="tableSettings.isPrivate" label="Privat" color="#4caf50" inset hide-details />

    <SimpleButton type="submit" class="mt-12" :label="$t('cockpit.myTables.editTable.update')" />
  </form>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'

import SimpleButton from '#app/components/buttons/SimpleButton.vue'
import StepHeader from '#app/components/steps/StepHeader.vue'
import { useTablesStore } from '#app/stores/tablesStore'

const props = defineProps<{
  tableId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const tablesStore = useTablesStore()

const { getTables: tables } = storeToRefs(tablesStore)

const table = computed(() => tables.value.find((table) => table.id === props.tableId))

const tableSettings = reactive({
  name: table.value?.name || '',
  isPrivate: table.value?.public,
})

const onSubmit = async (): Promise<void> => {
  if (!table.value) return

  await tablesStore.updateTable(table.value.id, tableSettings.name, !tableSettings.isPrivate)

  emit('close')
}
</script>
