<template>
  <CockpitCard narrow>
    <template #default>
      <div class="header mb-2">
        <v-avatar class="avatar d-flex align-center text-font bg-primary" size="90">
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
              <template #prepend> {{ item.props.circle }} <span class="ml-2"></span></template>
            </v-list-item>
          </template>
        </v-select>

        <template v-if="mode === 'view'">
          <button class="name" @click="editName">
            {{ props.name }}
            <v-icon icon="mdi mdi-pencil-outline"></v-icon>
          </button>
          <button class="introduction" @click="editIntroduction">
            {{ introduction }}
          </button>
        </template>
        <template v-else>
          <input
            ref="nameInput"
            :value="props.name"
            name="name"
            maxlength="100"
            @change="updateName"
          />
          <input
            ref="introductionInput"
            :value="props.introduction"
            :placeholder="introduction"
            class="introduction"
            name="introduction"
            maxlength="25"
            @change="updateIntroduction"
          />
        </template>
      </div>
      <button @click="$emit('edit-details')">
        <UserDetails :details="props.details" />
      </button>
      <button class="social" @click="$emit('edit-social')">
        <v-icon icon="mdi mdi-share-variant-outline" class="mr-2" />
        <ul v-if="props.social.length > 0" class="social-list">
          <li v-for="item in props.social" :key="item.type">
            <v-icon :icon="`mdi-${item.type}`"></v-icon>
          </li>
        </ul>
        <span v-else>
          {{ $t('cockpit.about-me.empty-social-media') }}
        </span>
      </button>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

import UserDetails from './UserDetails.vue'

import type { UserDetail, UserAvailability, SocialMedia } from '#stores/userStore'

const { t } = useI18n()

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
  (e: 'edit-details'): void
  (e: 'edit-social'): void
  (e: 'update-availability', status: UserAvailability): void
  (e: 'update-name', name: string): void
  (e: 'update-introduction', introduction: string): void
}>()

// Availability
const availability = ref(props.availability)

const availabilityOptions = [
  { value: null, title: 'Please choose', props: { circle: '⚪️' } },
  { value: 'available', title: 'Available to work', props: { circle: '🟢' } },
  { value: 'partly_available', title: 'Busy but have time', props: { circle: '🟡' } },
  { value: 'busy', title: 'Busy', props: { circle: '🔴' } },
]

const updateAvailability = (newAvailability: string) => {
  emit('update-availability', newAvailability as UserAvailability)
}

// Name and introduction
const mode = ref<'view' | 'edit-name' | 'edit-introduction'>('view')

const introduction = props.introduction || t('cockpit.about-me.introduction-placeholder')

const nameInput = ref<HTMLInputElement>()
const introductionInput = ref<HTMLInputElement>()

const editName = () => {
  mode.value = 'edit-name'
  window.requestAnimationFrame(() => nameInput.value?.focus())
}

const editIntroduction = () => {
  mode.value = 'edit-introduction'
  window.requestAnimationFrame(() => introductionInput.value?.focus())
}

const updateName = (event: Event) => {
  emit('update-name', (event.target as HTMLInputElement).value)
}

const updateIntroduction = (event: Event) => {
  emit('update-introduction', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.header {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 90px 1fr;
  gap: 2px 16px;
}

.avatar {
  grid-row: 1 / 4;
  border-radius: 15px;
}

.availability {
  grid-row: 1;
  grid-column: 2;

  &:deep(.v-input__control) {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding-top: 2px;
    padding-left: 8px;
    color: white;
    color: var(--v-cockpit-input-color);
    background: var(--v-cockpit-input-background);
    border: 1px solid rgb(214 223 233 / 40%);
    border-radius: 9999px;
  }

  &:deep(.v-field__outline) {
    display: none;
  }

  &:deep(.v-field__overlay) {
    display: none;
  }

  &:deep(.v-input__details) {
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
  grid-row: 2;
  grid-column: 2;
  text-align: left;
}

.introduction {
  grid-row: 3;
  grid-column: 2;
  font-size: 12px;
  text-align: left;
}

.social {
  display: flex;
  align-items: center;
  width: 300px;
  max-width: 300px;
  min-height: 60px;
  padding: 10px;
  margin-top: 10px;
  overflow: scroll;
  background: var(--v-cockpit-element-background);
  border-radius: 10px;
}

.social-list {
  display: flex;
  gap: 5px;
  align-items: center;
  list-style: none;
}

hr {
  margin-block: 10px;
  border-color: white;
}
</style>
