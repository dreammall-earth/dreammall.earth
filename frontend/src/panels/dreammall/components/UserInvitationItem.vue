<template>
  <v-list-item class="user-invitation-item ma-2 pa-2 pr-3 rounded-pill" elevation="0" rounded>
    <template #prepend>
      <v-avatar size="40">
        <v-img v-if="user.avatar" :src="user.avatar" :alt="user.name" cover></v-img>
        <svg v-else width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#E0E0E0" />
          <circle cx="20" cy="15" r="7" fill="#BDBDBD" />
          <path
            d="M6 34.5C6 27.5964 11.5964 22 18.5 22H21.5C28.4036 22 34 27.5964 34 34.5V40H6V34.5Z"
            fill="#BDBDBD"
          />
        </svg>
      </v-avatar>
    </template>

    <v-list-item-title class="text-white font-weight-medium">
      {{ user.name }}
    </v-list-item-title>

    <template #append>
      <v-btn
        elevation="0"
        :color="user.invited ? 'success' : 'secondary'"
        class="invitation-button text-caption py-2 px-3 rounded-pill"
        size="small"
        @click="invite"
      >
        {{ user.invited ? 'gesendet' : 'einladen' }}
      </v-btn>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface User {
  id: number
  name: string
  avatar: string | null
  invited: boolean
}

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  (e: 'update:invited', value: boolean): void
}>()

const invite = () => {
  if (!props.user.invited) emit('update:invited', true)
}
</script>

<style lang="scss" scoped>
.user-invitation-item {
  --background-user-item: #5d6670; // todo: save globally
  --background-invitation-button: #8b949b; // todo: save globally

  background-color: var(--background-user-item) !important;

  .invitation-button {
    &.bg-secondary {
      background-color: var(--background-invitation-button) !important;
    }
  }
}
</style>
