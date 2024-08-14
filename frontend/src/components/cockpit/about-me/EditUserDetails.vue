<template>
  <CockpitCard narrow>
    <template #header>
      <div class="header">
        <button class="back" @click="$emit('back')"><v-icon icon="$back"></v-icon></button>
        <h2>{{ $t('cockpit.about-me.edit.title') }}</h2>
      </div>
    </template>
    <template #default>
      <v-form class="add-detail mb-2" @submit.prevent="addDetail">
        <v-select
          v-model="newDetail.category"
          flat
          rounded
          :items="detailCategories"
          class="select-category"
          density="compact"
        >
          <template #selection="{ item }">
            <v-icon :icon="detailCategoryToIcon(item.value)"></v-icon>
          </template>
          <template #item="{ item, props: listProps }">
            <v-list-item v-bind="listProps" title="">
              <v-icon :icon="detailCategoryToIcon(item.value)"></v-icon>
            </v-list-item>
          </template>
        </v-select>
        <v-text-field
          v-model="newDetail.text"
          name="text"
          clearable
          rounded
          flat
          density="compact"
          variant="solo"
          class="add-detail-text"
          maxlength="60"
        ></v-text-field>
        <button
          type="submit"
          :disabled="newDetail.text?.length === 0"
          class="submit rounded-circle"
        >
          <v-icon icon="mdi mdi-plus"></v-icon>
        </button>
      </v-form>
      <!-- </div> -->
      <Details :details="props.details" editable @remove-detail="removeDetail" />
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

import { detailCategories, detailCategoryToIcon } from './detailCategories'
import Details from './UserDetails.vue'

import type { UserDetail, AddUserDetailInput } from '#stores/userStore'

const props = defineProps<{
  details: UserDetail[]
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'add-detail', detail: AddUserDetailInput): void
  (e: 'remove-detail', id: number): void
}>()

const newDetail = reactive<AddUserDetailInput>({
  category: 'work',
  text: '',
})

const addDetail = () => {
  emit('add-detail', newDetail)
}

const removeDetail = (id: number) => {
  emit('remove-detail', id)
}
</script>

<style scoped>
.back {
  width: 40px;
}

.header {
  display: flex;
  gap: 20px;
}

.add-detail {
  --height: 40px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  &:deep(.v-input__details) {
    display: none;
  }
}

.select-category {
  max-width: 80px;

  &:deep(.v-field__outline) {
    display: none;
  }
}

.add-detail-text {
  &:deep(.v-field) {
    background: rgba(93, 102, 112, 0.55);
  }
}

.submit {
  height: var(--height);
  width: var(--height);
  background: #f3f3f3;
  &:enabled {
    background: #23ad5b;
  }
}
</style>
