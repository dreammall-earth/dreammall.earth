<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <div class="reminder pa-5 rounded-lg text-white font-weight-medium">
      <p class="text-center">
        Deine Vision wird Realität,<br />
        lass uns gerne dazu den ersten Schritt machen.
      </p>
    </div>

    <SimpleButton class="mt-12 mx-auto" label="Los geht's" @click="onNext" />
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useTablesStore } from '#stores/tablesStore'

import { TableSetupEmits, TableSetupProps } from './TableSetupProps'

const props = defineProps<TableSetupProps>()
const emit = defineEmits<TableSetupEmits>()

const tablesStore = useTablesStore()

const onNext = async () => {
  await enterTable()
  emit('next')
}

const enterTable = async () => {
  try {
    const tableId = await tablesStore.joinMyTable()

    if (tableId) {
      await navigate(`/table/${tableId}`)
    } else {
      GlobalErrorHandler.error('No table found')
    }
  } catch (error) {
    GlobalErrorHandler.error('Error opening table', error)
  }
}
</script>

<style scoped lang="scss">
.reminder {
  background-color: #8b949b; // todo: save globally
}
</style>
