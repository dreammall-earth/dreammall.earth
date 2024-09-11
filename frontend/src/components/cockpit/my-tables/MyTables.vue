<template>
  <CockpitCard>
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
        <TableItem v-for="table in tables" :key="table.id" v-bind="table" />
      </ul>
      <div v-if="tables.length === 0">
        {{ $t('cockpit.myTables.noTables') }}
      </div>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'
import useModal from '#components/modal/useModal'
import { useTablesStore } from '#stores/tablesStore'

import CreateTable from './create-table/CreateTable.vue'
import TableItem from './TableItem.vue'

const { setComponent } = useModal()

const addTable = () => {
  setComponent(CreateTable)
}

const { getTables: tables } = storeToRefs(useTablesStore())
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
