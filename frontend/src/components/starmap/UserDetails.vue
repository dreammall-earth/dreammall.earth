<template>
  <ul class="details">
    <li v-for="detail in props.details" :key="detail.id">
      <v-chip class="detail border-thin">
        <v-icon
          :icon="detailCategoryToIcon(detail.category)"
          class="mr-2"
          color="cockpit-highlight"
        ></v-icon>
        {{ detail.text }}
      </v-chip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { detailCategoryToIcon } from '#src/utils/detailCategories'

import type { UserDetail } from '#stores/userStore'

const props = defineProps<{
  details: UserDetail[]
}>()
</script>

<style scoped>
.detail {
  background: rgb(61 71 83);

  &:deep(.v-chip__underlay) {
    display: none;
  }

  &:deep(.v-chip__content) {
    font-size: 11px;
  }
}

.details {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  width: 100%;
  padding: 10px;
  list-style: none;
}
</style>
