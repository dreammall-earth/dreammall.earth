<template>
  <CockpitCard narrow>
    <template #header>
      <div class="header">
        <h2>{{ $t('cockpit.myTables.header') }}</h2>
        <button>{{ $t('cockpit.myTables.addTable') }}</button>
      </div>
    </template>
    <template #default>
      <ul class="list">
        <li v-for="item in items" :key="item.id" class="table">
          <div class="table-info bg-dropdown-background">
            <span class="name">{{ item.name }}</span>
            <span class="subtitle">
              {{ $t('cockpit.myTables.memberCount', { count: item.memberCount }) }}
            </span>
          </div>
          <button class="action" @click="openTable(item.id)">
            <v-icon class="icon" icon="$camera" />
          </button>
        </li>
      </ul>
      <div v-if="items.length === 0">
        {{ $t('cockpit.myTables.noTables') }}
      </div>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'

const openTable = (id: number) => {
  navigate(`/table/${id}`)
}

const items = [
  {
    id: 1,
    name: 'Permakultur',
    memberCount: 5,
  },
  {
    id: 2,
    name: 'Cryptowährungen',
    memberCount: 23,
  },
]
</script>

<style scoped>
.header {
  display: flex;
  gap: 20px;
}

.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.table {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.table-info {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  height: 42px;
  padding: 5px 24px;
  border-radius: 16px 0 0 16px;
}

.name {
  height: 18px;
  font-size: 14px;
  font-weight: bold;
}

.subtitle {
  font-size: 11px;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  min-width: 41px;
  height: 42px;
  color: #fff;
  background-color: #f09630;
  border-radius: 0 16px 16px 0;
}

.icon {
  transform: scale(0.8);
}
</style>
