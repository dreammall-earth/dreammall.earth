<template>
  <CockpitCard>
    <template #header>
      <div class="header">
        <h2>{{ $t('cockpit.myTables.header') }}</h2>
        <button
          class="add-table bg-primary px-3 py-1 d-flex align-center justify-center"
          @click="addTable"
        >
          <v-icon icon="mdi mdi-plus" />
          {{ $t('cockpit.myTables.addTable') }}
        </button>
      </div>
    </template>
    <template #default>
      <ul v-if="projectTables.length > 0" class="list">
        <TableItem
          v-for="table in projectTables"
          :key="table.id"
          v-bind="table"
          ref="tableItemRefs"
          @option-opened="closeOptions"
        />
      </ul>
      <div v-else>
        {{ $t('cockpit.myTables.noTables') }}
      </div>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'
import useModal from '#components/modal/useModal'
import { useTablesStore } from '#stores/tablesStore'

import CreateTable from './create-table/CreateTable.vue'
import TableItem from './TableItem.vue'

import type { ProjectTable } from '#stores/tablesStore'

const { setComponent } = useModal()

const addTable = () => {
  setComponent(CreateTable)
}

const { getProjectTables } = storeToRefs(useTablesStore())

const projectTables = computed(() =>
  getProjectTables.value.map((table: ProjectTable) => ({
    id: table.id,
    name: table.name,
    moderatorCount: table.users.filter((user) => user.role === 'MODERATOR').length,
  })),
)

const tableItemRefs = ref<(typeof TableItem)[]>([])

const closeOptions = () => {
  tableItemRefs.value.forEach((tableItem) => {
    tableItem.closeOptions()
  })
}
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
  height: 78%;
  padding: 0;
  overflow: auto;
  list-style: none;
}

.add-table {
  font-size: 14px;
  color: white !important;
  border-radius: 20px;
}
</style>
