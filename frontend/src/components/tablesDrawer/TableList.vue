<template>
  <ul class="list" :data-type="$props.type">
    <li v-for="item in items" :key="item.meetingID" class="table">
      <div class="table-info bg-dropdown-background border-thin">
        <span class="name">{{ item.meetingName }}</span>
        <span class="subtitle">
          {{ $t('tables.participantCount', { count: item.participantCount }) }}
        </span>
      </div>
      <button
        class="action border-thin"
        :class="{ highlighted: item.amIModerator }"
        @click="openTable(item.id)"
      >
        <v-icon
          class="icon"
          :icon="item.type !== 'project' || item.amIModerator ? '$handshake' : '$reception'"
        />
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

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

.table {
  display: flex;
  gap: 8px;
  align-items: stretch;
  justify-content: center;
}

.table-info {
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: space-between;
  min-width: 0; /* flex items needs to size freely! */
  padding: 3px 24px;
  border-radius: 16px 0 0 16px;
}

.name {
  height: 18px;
  overflow: hidden;
  font-size: 14px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 10px;
  font-weight: 300;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  min-width: 41px;
  height: 42px;
  color: #fff;
  background-color: #979797;
  border-radius: 0 16px 16px 0;
}

.action.highlighted {
  background-color: var(--list-color);
}
</style>
