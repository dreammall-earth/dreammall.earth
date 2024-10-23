<template>
  <ul class="details" :class="{ editable: props.editable }">
    <li v-for="detail in details" :key="detail.id" class="detail">
      <v-chip class="detail-chip border-thin">
        <v-icon
          :icon="detailCategoryToIcon(detail.category)"
          class="mr-2"
          color="cockpit-highlight"
        ></v-icon>
        <span
          class="detail-text"
          :title="detail.text"
          tabindex="0"
          @click="$emit('edit-detail', detail.id, detail.category)"
          >{{ detail.text }}</span
        >
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

import type { UserDetail, UserDetailCategory } from '#stores/userStore'

const { t } = useI18n()

const props = defineProps<{
  details: UserDetail[]
  editable?: boolean
}>()

defineEmits<{
  (e: 'remove-detail', id: number): void
  (e: 'edit-detail', id: number, category: UserDetailCategory): void
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

.detail-text {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.detail-chip {
  background: var(--v-cockpit-chip-background);

  &:deep(.v-chip__underlay) {
    display: none;
  }

  &:deep(.v-chip__content) {
    width: 100%;
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
