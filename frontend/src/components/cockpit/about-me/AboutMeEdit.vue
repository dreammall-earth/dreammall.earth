<template>
  <CockpitCard narrow>
    <template #header>
      <div class="header">
        <button class="back" @click="$emit('back')"><v-icon icon="$back"></v-icon></button>
        <h2>{{ $t('cockpit.about-me.edit.title') }}</h2>
      </div>
    </template>
    <template #default>
      <v-select
        v-model="newDetail.category"
        :items="detailTypes"
        label="Type"
        name="type"
      ></v-select>
      <v-text-field v-model="newDetail.text" name="text"></v-text-field>
      <v-btn @click="addDetail">{{ $t('cockpit.about-me.edit.add') }}</v-btn>
      <ul class="details">
        <li v-for="item in props.details" :key="item.id">
          <v-icon icon="$close" @click="() => removeDetail(item.id)"></v-icon>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

import type {
  UserDetail,
  SocialMedia,
  UserDetailCategory,
  AddUserDetailInput,
} from '#stores/userStore'

const props = defineProps<{
  username: string
  name: string
  userImage?: string
  initials?: string
  introduction?: string
  details: UserDetail[]
  social: SocialMedia[]
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'add-detail', detail: AddUserDetailInput): void
  (e: 'remove-detail', id: number): void
}>()

const newDetail = reactive<AddUserDetailInput>({
  category: 'place',
  text: '',
})

const detailTypes: UserDetailCategory[] = ['place', 'work', 'education', 'feeling', 'language']

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

.details {
  min-height: 50px;
}
</style>
