<template>
  <ul class="details">
    <li v-for="detail in props.details" :key="detail.id" class="detail">
      <v-chip class="detail-chip border-thin">
        <v-icon
          :icon="detailCategoryToIcon(detail.category)"
          class="mr-2"
          color="cockpit-highlight"
        ></v-icon>
        <span
          class="detail-text"
          :class="{ 'two-line': twoLine === detail.id }"
          :title="detail.text"
          tabindex="0"
          @click="toggleTwoLine(detail.id)"
          >{{ detail.text }}</span
        >
      </v-chip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { detailCategoryToIcon } from '#src/utils/detailCategories'

import type { UserDetail } from '#stores/userStore'

const props = defineProps<{
  details: UserDetail[]
}>()

const twoLine = ref<number | null>(null)

const toggleTwoLine = (detailId: number) => {
  twoLine.value = twoLine.value === detailId ? null : detailId
}
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

  &.two-line {
    text-wrap: pretty;
  }
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
