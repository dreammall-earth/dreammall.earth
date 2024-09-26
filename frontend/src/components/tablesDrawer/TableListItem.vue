<template>
  <li class="table">
    <div
      class="table-info border-thin"
      :class="{ highlighted: item.isModerator, welcome: item.type === 'welcome' }"
    >
      <span class="name">{{ item.meetingName }}</span>
      <span class="subtitle">
        {{ $t('tables.participantCount', { count: item.participantCount }) }}
      </span>
    </div>
    <button
      class="action border-thin"
      :class="{ highlighted: item.isModerator, welcome: item.type === 'welcome' }"
      @click="$emit('open-table')"
    >
      <v-icon
        class="icon"
        :icon="item.type !== 'project' || item.isModerator ? '$handshake' : '$reception'"
      />
    </button>
    <img
      v-if="item.type === 'welcome'"
      :src="WelcomeBadge"
      alt="Welcome"
      class="welcome-badge"
      :class="{ dark: $vuetify.theme.current.dark }"
    />
    <div v-else class="badge" :class="{ highlighted: item.isModerator }">
      {{
        item.isModerator
          ? $t('tables.member')
          : item.type === 'mallTalk'
            ? $t('tables.mallTalk')
            : $t('tables.project')
      }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import WelcomeBadge from '#assets/welcome-badge.svg'
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
  background: var(--v-drawer-element-background);
  border-radius: 16px 0 0 16px;
}

.table-info.highlighted {
  border-color: var(--list-color) !important;
}

.table-info.welcome::before {
  background: linear-gradient(45deg, #f09630, #2ca5b1) border-box; /* 3 */
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

.action.highlighted.welcome {
  color: var(--v-theme-font);
  background-color: var(--v-drawer-element-background);
}

.action.welcome::before {
  color: black;
  background: linear-gradient(45deg, #2ca5b1, #f09630) border-box; /* 3 */
  border-radius: 0 16px 16px 0;
}

.welcome {
  position: relative;
  border: none !important;
}

.welcome::before {
  position: absolute;
  inset: 0;
  content: '';
  border: 0.5px solid transparent;
  mask: /*4*/
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask-composite: xor; /* 5' */
  mask-composite: exclude; /* 5 */
}

.badge {
  position: absolute;
  right: 80px;
  bottom: -6px;
  width: 59px;
  height: 13px;
  font-size: 9px;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  text-transform: uppercase;
  background: var(--v-drawer-element-background);
  border-radius: 6px;
}

.badge.highlighted {
  color: var(--list-color);
  border-color: var(--list-color) !important;
}

.welcome-badge {
  position: absolute;
  right: 80px;
  bottom: -20px;
}

.welcome-badge.dark {
  filter: invert(1) brightness(4);
}
</style>
