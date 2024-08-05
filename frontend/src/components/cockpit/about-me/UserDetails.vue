<template>
  <ul class="details">
    <li v-for="(detail, index) in props.details" :key="index">
      <v-chip class="detail">
        <v-icon :icon="detailCategoryToIcon(detail.category)" class="mr-2"></v-icon>
        {{ detail.text }}
        <v-icon v-if="props.editable" icon="$close" @click="$emit('remove-detail', detail.id)">
        </v-icon
      ></v-chip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { detailCategoryToIcon } from './detailCategoryToIcon'

import type { UserDetail } from '#stores/userStore'

const props = defineProps<{
  details: UserDetail[]
  editable?: boolean
}>()

defineEmits<{
  (e: 'remove-detail', id: number): void
}>()
</script>

<style scoped>
.details {
  padding: 0;
  list-style: none;
}

.details {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  width: 300px;
  padding: 10px;
  border-radius: 15px;
  background: #f3f3f3;
  min-height: 60px;
}
</style>
