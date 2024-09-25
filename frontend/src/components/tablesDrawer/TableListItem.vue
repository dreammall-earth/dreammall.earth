<template>
  <li class="table">
    <div
      class="table-info bg-dropdown-background border-thin"
      :class="{ highlighted: item.amIModerator }"
    >
      <span class="name">{{ item.meetingName }}</span>
      <span class="subtitle">
        {{ $t('tables.participantCount', { count: item.participantCount }) }}
      </span>
    </div>
    <button
      class="action border-thin"
      :class="{ highlighted: item.amIModerator }"
      @click="$emit('open-table')"
    >
      <v-icon
        class="icon"
        :icon="item.type !== 'project' || item.amIModerator ? '$handshake' : '$reception'"
      />
    </button>
    <div class="badge border-thin" :class="{ highlighted: item.amIModerator }">
      {{
        item.amIModerator
          ? $t('tables.member')
          : item.type === 'mallTalk'
            ? $t('tables.mallTalk')
            : $t('tables.project')
      }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import { OpenTable } from '#stores/tablesStore'

defineProps<{
  item: OpenTable
}>()

defineEmits<{
  (e: 'open-table'): void
}>()
</script>
<style scoped>
.table {
  position: relative;
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

.table-info.highlighted {
  border-color: var(--list-color) !important;
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

.badge {
  position: absolute;
  bottom: -6px;
  right: 80px;
  border-radius: 6px;

  background: #f5f5f5;
  width: 59px;
  height: 13px;
  font-size: 9px;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  text-align: center;
}

.badge.highlighted {
  border-color: var(--list-color) !important;
  color: var(--list-color);
}
</style>
