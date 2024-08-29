<template>
  <CreateTable v-model="newTable" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import CreateTable from './CreateTable.vue'

export type CreateTableInput = {
  isPublic: boolean
  name: string
  userIds: number[]
}

const newTable = reactive({
  isPublic: false,
  name: '',
  userIds: [],
})
</script>
