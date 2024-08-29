<template>
  <CockpitCard narrow>
    <template #header>
      <div class="header">
        <h2>{{ $t('cockpit.myTables.header') }}</h2>
        <button class="add-table bg-primary px-3 py-1" @click="addTable">
          <v-icon icon="mdi mdi-plus" />
          {{ $t('cockpit.myTables.addTable') }}
        </button>
      </div>
    </template>
    <template #default>
      <ul class="list">
        <TableItem v-for="item in items" :key="item.id" v-bind="item" />
      </ul>
      <div v-if="items.length === 0">
        {{ $t('cockpit.myTables.noTables') }}
      </div>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { h } from 'vue'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'
import usePanel from '#src/panels/usePanel'

import CreateTable from './CreateTable.vue'
import TableItem from './TableItem.vue'

const { setComponent } = usePanel()

const addTable = () => {
  setComponent(h(CreateTable))
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
  align-items: center;
  justify-content: space-between;
}

.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.add-table {
  font-size: 14px;
  color: white !important;
  border-radius: 20px;
}
</style>
