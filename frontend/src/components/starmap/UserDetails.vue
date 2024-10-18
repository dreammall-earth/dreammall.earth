<template>
  <ul class="details">
    <li v-for="detail in props.details" :key="detail.id" class="detail">
      <v-chip class="detail-chip border-thin">
        <v-icon
          :icon="detailCategoryToIcon(detail.category)"
          class="mr-2"
          color="cockpit-highlight"
        ></v-icon>
        <span class="detail-text" :title="detail.text" tabindex="0">{{ detail.text }}</span>
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
  overflow: hidden;
}

.detail-text {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.detail-chip {
  background: rgb(61 71 83);

  &:deep(.v-chip__underlay) {
    display: none;
  }

  &:deep(.v-chip__content) {
    font-size: 11px;
    width: 100%;
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
