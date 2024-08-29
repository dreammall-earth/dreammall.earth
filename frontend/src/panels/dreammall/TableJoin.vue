<template>
  <PanelHeader
    title="Tisch betreten"
    :is-back-button-visible="false"
    :is-close-button-visible="false"
  />
  <SimpleButton label="Tisch betreten" icon="mdi-video" class="mb-5" @click="onClick" />
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import PanelHeader from '#src/panels/PanelHeader.vue'
import { useTablesStore } from '#stores/tablesStore'
import {navigate} from "vike/client/router";

const tablesStore = useTablesStore()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const onClick = async () => {
  try {
    emit('close')

    const tableId = await tablesStore.joinMyTable()
    if (!tableId) {
      GlobalErrorHandler.error('Could not join myTable')
      return
    }

    await navigate(`/table/${tableId}`)
  } catch (error) {
    GlobalErrorHandler.error('Error opening table', error)
  }
}
</script>

