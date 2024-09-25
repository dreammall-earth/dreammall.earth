<template>
  <div class="outer-list">
    <div class="mb-4 d-flex align-center justify-space-between">
      <h2 class="header">{{ list.heading }}</h2>
      <button @click="toggleCollapsed">
        <v-icon icon="mdi mdi-menu-down" :class="{ 'mdi-rotate-180': isCollapsed }" />
      </button>
    </div>
    <slot></slot>
    <div ref="listContentRef" class="list-content" :class="{ collapsed: isCollapsed }">
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
import { computed, ref, watch } from 'vue'

import { collapseSection, expandSection } from '#src/utils/collapseSection'

import TableListItem from './TableListItem.vue'

import type { OpenTable } from '#stores/tablesStore'

const props = defineProps<{
  list: {
    heading: string
    items: OpenTable[]
    type: 'mallTalk' | 'projects'
  }
  searchValue: string
}>()

const emit = defineEmits(['openTable'])

const isCollapsed = ref(false)

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
}

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

const listContentRef = ref<HTMLElement | null>(null)

watch(isCollapsed, () => {
  if (listContentRef.value) {
    if (isCollapsed.value) {
      collapseSection(listContentRef.value)
    } else {
      expandSection(listContentRef.value)
    }
  }
})
</script>

<style scoped>
.outer-list {
  font-size: 12px;
}

.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  height: calc(40vh - 80px);
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
