<template>
  <CockpitCard narrow>
    <template #default>
      <div class="header">
        <v-avatar class="avatar d-flex align-center text-font bg-primary" size="75">
          <v-img v-if="props.userImage" :src="props.userImage" />
          <span v-else>{{ props.initials }}</span>
        </v-avatar>
        <div class="availability-container">
          <select v-model="availability" class="availability" @change="updateAvailability">
            <option v-for="item in availabilityOptions" :key="item.value || 0" :value="item.value">
              {{ item.circle }} {{ item.text }}
            </option>
          </select>
        </div>
        <div class="name">
          {{ props.name }}
          <button @click="$emit('edit')"><v-icon icon="$edit"></v-icon></button>
        </div>
        <div class="introduction">{{ props.introduction }}</div>
      </div>
      <ul class="details">
        <li v-for="(detail, index) in props.details" :key="index">
          <v-chip :prepend-icon="detailCategoryToIcon(detail.category)" class="detail">{{
            detail.text
          }}</v-chip>
        </li>
      </ul>
      <ul class="social">
        <li v-for="item in props.social" :key="item.type">
          <a :href="item.link" target="_blank" rel="noopener noreferrer">
            <v-icon :icon="`mdi-${item.type}`"></v-icon>
          </a>
        </li>
      </ul>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

import { detailCategoryToIcon } from './detailCategoryToIcon'

import type { UserDetail, UserAvailability, SocialMedia } from '#stores/userStore'

const props = defineProps<{
  username: string
  name: string
  userImage?: string
  initials?: string
  introduction?: string
  availability: UserAvailability
  details: UserDetail[]
  social: SocialMedia[]
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'update-availability', status: UserAvailability): void
}>()

const availability = ref(props.availability)

const availabilityOptions = [
  { circle: '⚪️', value: null, text: 'Please choose' },
  { circle: '🟢', value: 'available', text: 'Available to work' },
  { circle: '🟡', value: 'partly_available', text: 'Busy but have time' },
  { circle: '🔴', value: 'busy', text: 'Busy' },
]

const updateAvailability = (event: Event) => {
  emit('update-availability', (event.target as HTMLSelectElement).value as UserAvailability)
}
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 75px 1fr;
  grid-template-rows: 1 fr 1fr 1fr;
  gap: 10px;
}

.avatar {
  grid-row: 1 / 3;
  border-radius: 15px;
}

.availability::after,
.availability-container {
  grid-column: 2;
  grid-row: 1;

  content: '';

  font-size: 10px;
  color: white;
  display: flex;
  height: 24px;
  padding: 0px 12px 0px 4px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(214, 223, 233, 0.4);
  background: #5d6670;
  color: white;

  select {
    color: white;
  }
}

.name {
  grid-column: 2;
  grid-row: 2;
}

.introduction {
  grid-column: 2;
  grid-row: 3;
  font-size: 12px;
}

.details,
.social {
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

.detail {
  font-size: 10px !important;
}

.social {
  display: flex;
  min-height: 30px;
}

hr {
  margin-block: 10px;
  border-color: white;
}
</style>
