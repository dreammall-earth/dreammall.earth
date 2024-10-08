<template>
  <div class="outer-list">
    <div class="mb-4 d-flex align-center justify-space-between">
      <h2 class="header">{{ list.heading }}</h2>
      <button @click="toggleCollapse">
        <v-icon
          icon="mdi mdi-menu-down"
          :class="{ 'mdi-rotate-180': collapseState === 'collapsed' }"
        />
      </button>
    </div>
    <slot></slot>
    <div
      ref="listContentRef"
      class="list-content"
      :class="{ collapsed: collapseState === 'collapsed' }"
    >
      <div v-if="!list.items.length">{{ $t('tablesDrawer.noTables') }}</div>
      <div v-else-if="!filteredItems.length">
        {{ $t('tablesDrawer.noResults') }}
      </div>
      <ul v-if="filteredItems.length > 0" class="list" :data-type="$props.list.type">
        <TableListItem
          v-for="item in filteredItems"
          :key="item.meetingID"
          :item="item"
          @open-table="openTable(item.id)"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { computed, ref } from 'vue'

import { useCollapseSection } from '#src/utils/useCollapseSection'

import TableListItem from './TableListItem.vue'

import type { Table } from '#stores/tablesStore'

const props = defineProps<{
  list: {
    heading: string
    items: Table[]
    type: 'mallTalk' | 'projects'
  }
  searchValue: string
}>()

const emit = defineEmits(['openTable'])

const listContentRef = ref<HTMLElement | null>(null)

const { collapseState, toggleCollapse } = useCollapseSection(listContentRef)

const filteredItems = computed(() => {
  if (!props.searchValue) {
    return props.list.items
  }
  return props.list.items.filter(
    (item) =>
      item.meetingName.toLowerCase().includes(props.searchValue.toLowerCase()) ||
      item.attendees.find((attendee) =>
        attendee.fullName.toLowerCase().includes(props.searchValue.toLowerCase()),
      ),
  )
})

const openTable = (id: number) => {
  emit('openTable')
  navigate(`/table/${id}`)
}
</script>

<style scoped>
.outer-list {
  font-size: 12px;
}

.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  max-height: calc(40vh - 80px);
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.list[data-type='mallTalk'] {
  --list-color: #f09630;
}

.list[data-type='projects'] {
  --list-color: #2ca5b1;
}

.header {
  font-size: 14px;
  text-transform: uppercase;
}

.list-content {
  transition: height 0.3s;
}
</style>
