<template>
  <div class="sidebar">
    <div class="close">
      <v-btn icon variant="text" size="small" @click="$emit('close')">
        <v-icon icon="mdi-close" />
      </v-btn>
    </div>
    <v-avatar :size="85" class="avatar mb-2 text-font">
      <span>{{ getInitials(props.profile.name) }}</span>
    </v-avatar>
    <h3 class="mt-2">{{ props.profile.name }}</h3>

    <div class="availability mt-4 mb-4">
      <v-icon icon="mdi mdi-circle" :color="availability?.props.circleColor" />
      {{ availability?.title }}
    </div>
    <UserDetails :details="props.profile.details" />

    <ul v-if="props.profile.social.length > 0" class="social-list mt-8">
      <li v-for="item in props.profile.social" :key="item.type" class="px-1">
        <a
          :href="buildSocialMediaLink(item.type, item.link)"
          rel="nofollow noopener noreferrer"
          target="_blank"
          ><v-icon :icon="getSocialMediaIcon(item.type)"></v-icon
        ></a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { getSocialMediaIcon, buildSocialMediaLink } from '#constants/socialMediaPlatforms'
import { getInitials } from '#src/utils/getInitials'

import UserDetails from './UserDetails.vue'

import type { UserWithProfile } from '#stores/userStore'

const props = defineProps<{
  profile: UserWithProfile
}>()

defineEmits<{
  (e: 'close'): void
}>()

const availability = computed(() =>
  availabilityOptions.find((a) => a.value === props.profile.availability),
)

const availabilityOptions = [
  { value: null, title: 'Not specified', props: { circleColor: '#CCCCCC' } },
  { value: 'available', title: 'Available to work', props: { circleColor: '#23AD5B' } },
  { value: 'partly_available', title: 'Busy but has time', props: { circleColor: '#F09630' } },
  { value: 'busy', title: 'Busy', props: { circleColor: '#D02F44' } },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 90px;
  right: 0;
  z-index: 200;
  display: flex;
  flex-flow: column;
  align-items: center;
  width: min(350px, 100vw);
  height: 100%;
  color: #f5f5f5;
  background: rgb(61 71 83 / 75%);
  backdrop-filter: blur(15px);
  border-radius: 15px 0 0 15px;
}

.close {
  display: flex;
  place-content: flex-start flex-start;
  align-items: flex-start;
  justify-content: flex-end;
  width: 100%;
  padding: 8px 16px;
}

.avatar {
  background-color: rgb(var(--v-theme-cockpit-highlight));
  border-radius: 50%;
}

.availability {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding-inline: 8px;
  font-size: 10px;
  color: white;
  background: #5d6670;
  border: 1px solid rgb(214 223 233 / 40%);
  border-radius: 9999px;
}

.social-list {
  display: flex;
  gap: 5px;
  align-items: center;
  list-style: none;
}
</style>
