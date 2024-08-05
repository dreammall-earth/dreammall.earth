<template>
  <CockpitCard narrow>
    <template #default>
      <div class="header">
        <v-avatar class="avatar d-flex align-center text-font bg-primary" size="75">
          <v-img v-if="props.userImage" :src="props.userImage" />
          <span v-else>{{ props.initials }}</span>
        </v-avatar>
        <v-select
          v-model="availability"
          round
          flat
          :items="availabilityOptions"
          class="availability"
          @update:model-value="updateAvailability"
        >
          <template #selection="{ item }"> {{ item.props.circle }} {{ item.title }} </template>
          <template #item="{ item, props: listProps }">
            <v-list-item v-bind="listProps">
              <template #prepend> {{ item.props.circle }}</template>
            </v-list-item>
          </template>
        </v-select>

        <div class="name">
          {{ props.name }}
          <button @click="$emit('edit')"><v-icon icon="$edit"></v-icon></button>
        </div>
        <div class="introduction">{{ props.introduction }}</div>
      </div>
      <Details :details="props.details" />
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

import Details from './UserDetails.vue'

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
  { value: null, title: 'Please choose', props: { circle: '⚪️' } },
  { value: 'available', title: 'Available to work', props: { circle: '🟢' } },
  { value: 'partly_available', title: 'Busy but have time', props: { circle: '🟡' } },
  { value: 'busy', title: 'Busy', props: { circle: '🔴' } },
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

.availability {
  grid-column: 2;
  grid-row: 1;

  &:deep(.v-input__control) {
    color: white;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    border: 1px solid rgba(214, 223, 233, 0.4);
    background: #5d6670;
    padding-left: 8px;
    padding-top: 2px;
  }

  &:deep(.v-field__outline) {
    display: none;
  }

  &:deep(.v-field__overlay) {
    display: none;
  }

  &:deep(.v-field__input) {
    padding-inline: 0;
  }

  &:deep(.v-field__append-inner) {
    margin-right: -8px;
  }

  &:deep(.v-select__selection) {
    font-size: 10px;
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

.social {
  padding: 0;
  list-style: none;
  display: flex;
  min-height: 30px;
}

hr {
  margin-block: 10px;
  border-color: white;
}
</style>
