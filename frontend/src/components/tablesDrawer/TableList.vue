<template>
  <ul class="list" :data-type="$props.type">
    <TableListItem
      v-for="item in items"
      :key="item.meetingID"
      :item="item"
      @open-table="openTable(item.id)"
    />
  </ul>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import TableListItem from './TableListItem.vue'

import type { OpenTable } from '#stores/tablesStore'

defineProps<{
  items: OpenTable[]
  type: 'mallTalk' | 'projects'
}>()

const emit = defineEmits(['openTable'])

const openTable = (id: number) => {
  emit('openTable')
  navigate(`/table/${id}`)
}
</script>

<style scoped>
.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.list[data-type='mallTalk'] {
  --list-color: #f09630;
}

.list[data-type='projects'] {
  --list-color: #2ca5b1;
}
</style>
