<template>
  <CockpitCard>
    <template #header>
      <div class="header">
        <button class="back" @click="$emit('back')">
          <v-icon icon="mdi mdi-chevron-left" color="icon" />
        </button>
        <h2>{{ $t('cockpit.about-me.edit.title') }}</h2>
      </div>
    </template>
    <template #default>
      <v-form class="add-detail mb-2" @submit.prevent="submit">
        <v-select
          v-model="category"
          flat
          rounded
          :items="detailCategories"
          class="select-category"
          density="compact"
          :disabled="isUpdate"
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
          v-model="text"
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
          v-if="isUpdate && (!text || text?.length === 0)"
          class="submit rounded-circle"
          @click="abortUpdate"
        >
          <v-icon icon="mdi mdi-close" />
        </button>

        <button
          v-else
          type="submit"
          :disabled="!text || text?.length === 0 || props.loading"
          class="submit rounded-circle"
        >
          <v-icon :icon="submitIcon"></v-icon>
        </button>
      </v-form>
      <!-- </div> -->
      <Details
        :details="props.details"
        editable
        @remove-detail="removeDetail"
        @edit-detail="editDetail"
      />
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'
import { UserDetailCategory, useUserStore } from '#stores/userStore'

import { detailCategories, detailCategoryToIcon } from './detailCategories'
import Details from './UserDetails.vue'

import type { UserDetail } from '#stores/userStore'

const userStore = useUserStore()

const props = defineProps<{
  details: UserDetail[]
  loading?: boolean
}>()

defineEmits<{
  (e: 'back'): void
}>()

const isUpdate = ref(false)
const id = ref<number | null>(null)
const category = ref<UserDetailCategory>('work')
const text = ref<string | null>(null)

const submitIcon = computed(() =>
  isUpdate.value
    ? 'mdi mdi-pencil'
    : !text.value || text.value?.length === 0 || props.loading
      ? 'mdi mdi-plus'
      : 'mdi mdi-check',
)

const resetDetail = () => {
  text.value = ''
  category.value = 'work'
  id.value = 0
}

const abortUpdate = () => {
  isUpdate.value = false
  resetDetail()
}

const addDetail = async () => {
  if (!text.value) throw new Error('No text provided')

  await userStore.addUserDetail({
    category: category.value,
    text: text.value,
  })
  text.value = ''
}

const removeDetail = async (id: number) => {
  await userStore.removeUserDetail(id)
  abortUpdate()
}

const editDetail = (detailId: number) => {
  const detail = props.details.find((detail) => detail.id === detailId)
  if (!detail) return
  isUpdate.value = true
  id.value = detailId
  category.value = detail.category
  text.value = detail.text
}

const updateDetail = async () => {
  if (!id.value) throw new Error('No detail id provided')
  if (!text.value) throw new Error('No text provided')

  await userStore.updateUserDetail({
    id: id.value,
    text: text.value,
  })
  isUpdate.value = false
  resetDetail()
}

const submit = () => {
  if (isUpdate.value) {
    updateDetail()
  } else {
    addDetail()
  }
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
  max-width: 70px;

  &:deep(.v-field__outline) {
    display: none;
  }

  &:deep(.v-field--center-affix .v-field__append-inner) {
    margin-left: 34px;
  }

  &:deep(.v-field__append-inner) {
    display: none;
  }
}

.add-detail-text {
  &:deep(.v-field) {
    background: var(--v-cockpit-element-background);
  }
}

.submit {
  width: var(--height);
  height: var(--height);
  background: var(--v-cockpit-input-background);

  &:enabled {
    color: white;
    background: #23ad5b;
  }
}
</style>
