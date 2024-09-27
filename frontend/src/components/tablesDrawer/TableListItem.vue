<template>
  <li class="table" :class="{ highlighted: item.isModerator, welcome: item.type === 'PERMANENT' }">
    <div class="table-info border-thin">
      <span class="name">{{ item.meetingName }}</span>
      <span class="subtitle">
        {{ $t('tables.participantCount', { count: item.participantCount }) }}
      </span>
    </div>
    <button class="action border-thin" @click="$emit('open-table')">
      <v-icon
        class="icon"
        :icon="
          item.type !== 'PROJECT' || item.isModerator || item.meetingID
            ? '$handshake'
            : '$reception'
        "
      />
    </button>
    <img
      v-if="item.type === 'PERMANENT'"
      :src="WelcomeBadge"
      alt="Welcome"
      class="welcome-badge"
      :class="{ dark: $vuetify.theme.current.dark }"
    />
    <div v-else class="badge border-thin" :class="{ highlighted: item.isModerator }">
      {{
        item.isModerator
          ? $t('tables.member')
          : item.type === 'MALL_TALK'
            ? $t('tables.mallTalk')
            : $t('tables.project')
      }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import WelcomeBadge from '#assets/welcome-badge.svg'
import { Table } from '#stores/tablesStore'

defineProps<{
  item: Table
}>()

defineEmits<{
  (e: 'open-table'): void
}>()
</script>
<style scoped>
.table-info {
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: space-between;
  min-width: 0;
  padding: 3px 24px;
  background: var(--v-drawer-element-background);
  border-radius: 16px 0 0 16px;
  transition:
    border-color 0.3s,
    color 0.3s,
    background 0.3s;
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
  transition:
    border-color 0.3s,
    color 0.3s,
    background 0.3s;
}

.table {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: stretch;
  justify-content: center;
  margin-bottom: 6px;

  &.welcome {
    .table-info,
    .action {
      position: relative;
      border: none !important;

      /* Gradient border */
      &::before {
        position: absolute;
        inset: 0;
        content: '';
        border: 1px solid transparent;
        mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        mask-composite: xor;
        mask-composite: exclude;
      }

      /* Gradient background */
      &::after {
        position: absolute;
        inset: 0;
        z-index: -1;
        content: '';
        opacity: 0;
        transition: opacity 0.3s;
      }
    }

    .table-info {
      &::before {
        background: linear-gradient(130deg, #f09630, #2ca5b1) border-box;
        border-radius: 16px 0 0 16px;
      }

      &::after {
        background: linear-gradient(130deg, #f09630, #2ca5b1);
        border-radius: 16px 0 0 16px;
      }
    }

    .action {
      color: var(--v-theme-font);
      background-color: var(--v-drawer-element-background);

      &::before {
        background: linear-gradient(130deg, #2ca5b1, #f09630) border-box;
        border-radius: 0 16px 16px 0;
      }

      &::after {
        background: linear-gradient(130deg, #2ca5b1, #f09630);
        border-radius: 0 16px 16px 0;
      }
    }

    &:hover {
      .table-info,
      .action {
        color: #f5f5f5;
        background-color: transparent;

        &::after {
          opacity: 1;
        }
      }
    }
  }

  &:not(.welcome) {
    &:hover,
    &.highlighted {
      .table-info {
        border-color: var(--list-color) !important;
      }

      .action {
        background-color: var(--list-color);
      }
    }
  }
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

  &.highlighted {
    color: var(--list-color);
    border-color: var(--list-color) !important;
  }
}

.welcome-badge {
  position: absolute;
  right: 80px;
  bottom: -20px;

  &.dark {
    filter: invert(1) brightness(4);
  }
}
</style>
