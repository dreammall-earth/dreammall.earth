<template>
  <ul class="details">
    <li v-for="(detail, index) in details" :key="index">
      <v-chip class="detail">
        <v-icon :icon="detailCategoryToIcon(detail.category)" class="mr-2"></v-icon>
        {{ detail.text }}
        <v-icon
          v-if="props.editable && detail.id >= 0"
          icon="$close"
          @click="$emit('remove-detail', detail.id)"
        >
        </v-icon
      ></v-chip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { detailCategories } from './detailCategories'
import { detailCategoryToIcon } from './detailCategoryToIcon'

import type { UserDetail } from '#stores/userStore'

const { t } = useI18n()

const props = defineProps<{
  details: UserDetail[]
  editable?: boolean
}>()

defineEmits<{
  (e: 'remove-detail', id: number): void
}>()

const details: Ref<UserDetail[]> = computed(() =>
  detailCategories.map((category) => {
    const detail = props.details.find((detail) => detail.category === category)
    if (detail) return detail
    return { id: -1, category, text: t(`cockpit.about-me.${category}-placeholder`) }
  }),
)
</script>

<style scoped>
.details {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  width: 300px;
  min-height: 60px;
  padding: 0;
  padding: 10px;
  list-style: none;
  background: #f3f3f3;
  border-radius: 15px;
}
</style>
