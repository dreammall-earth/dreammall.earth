<template>
  <ul class="details" :class="{ editable: props.editable }">
    <li v-for="detail in details" :key="detail.id" class="detail">
      <v-chip class="detail-chip border-thin">
        <v-icon
          :icon="detailCategoryToIcon(detail.category)"
          class="mr-2"
          color="cockpit-highlight"
        ></v-icon>
        {{ detail.text }}
        <button
          v-if="props.editable && detail.id > 0"
          class="pl-1"
          @click="$emit('remove-detail', detail.id)"
        >
          <v-icon icon="$close" />
        </button>
      </v-chip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { detailCategories, detailCategoryToIcon } from './detailCategories'

import type { UserDetail } from '#stores/userStore'

const { t } = useI18n()

const props = defineProps<{
  details: UserDetail[]
  editable?: boolean
}>()

defineEmits<{
  (e: 'remove-detail', id: number): void
}>()

const details: Ref<UserDetail[]> = computed(() => {
  const newDetails = [] as UserDetail[]
  for (const [index, category] of detailCategories.entries()) {
    const detail = props.details.find((detail) => detail.category === category)
    if (!detail) {
      newDetails.push({
        id: -index,
        category,
        text: t(`cockpit.about-me.${category}-placeholder`),
      })
    }
  }
  return [...props.details, ...newDetails]
})
</script>

<style scoped>
.detail {
  overflow: hidden;
}

.detail-chip {
  background: var(--v-cockpit-chip-background);

  &:deep(.v-chip__underlay) {
    display: none;
  }

  &:deep(.v-chip__content) {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
}

.details {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  width: 100%;
  min-height: 60px;
  max-height: 110px;
  padding: 10px;
  overflow-y: auto;
  list-style: none;
  background: var(--v-cockpit-element-background);
  border-radius: 15px;

  &.editable {
    max-height: 178px;
    padding: 0;
    background: unset;

    .detail-chip {
      background: var(--v-cockpit-chip-background-2);
    }
  }
}
</style>
