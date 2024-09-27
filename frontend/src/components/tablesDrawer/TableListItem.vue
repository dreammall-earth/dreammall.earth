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
.table {
  position: relative;
  display: flex;
  gap: 8px;
  align-items: stretch;
  justify-content: center;
  margin-bottom: 6px;

  &:not(.welcome) {
    &:hover {
      .table-info {
        border-color: var(--list-color) !important;
      }
      .action {
        background-color: var(--list-color);
      }
    }
  }

  &.welcome {
    --gradient-color-1: rbg(240, 150, 48);
    --gradient-color-2: rgb(44, 165, 177);

    .table-info {
      /* background: linear-gradient(130deg, rgba(240, 150, 48, 0.1), rgb(44, 165, 177, 0.1)); */
    }

    .action {
      background: linear-gradient(130deg, #2ca5b1, #f09630);
    }

    .table-info,
    .action {
      position: relative;
      border: none !important;

      &::before {
        position: absolute;
        z-index: -1;
        inset: 0;
        content: '';
        border: 0.5px solid transparent;
        mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
      }
    }
    .table-info {
      &::before {
        background: linear-gradient(130deg, #f09630, #2ca5b1) border-box;
        border-radius: 16px 0 0 16px;
      }
    }
    .action {
      background-color: var(--v-drawer-element-background);
      color: var(--v-theme-font);

      &::before {
        color: black;
        background: linear-gradient(130deg, #2ca5b1, #f09630) border-box;
        border-radius: 0 16px 16px 0;
      }
    }

    &:hover {
      .table-info {
        color: #f5f5f5;
        /* background: linear-gradient(130deg, rgba(240, 150, 48, 1), rgb(44, 165, 177, 1)); */
        &::before {
          opacity: 1;
        }
      }

      .action {
        color: #f5f5f5;
        /* background: linear-gradient(130deg, #2ca5b1, #f09630); */
      }
    }
  }
}

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
  transition:
    border-color 0.3s,
    color 0.3s,
    background 0.3s,
    background-opacity 0.3s;
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
