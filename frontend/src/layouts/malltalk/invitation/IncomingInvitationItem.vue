<template>
  <div class="invitation-item d-flex align-center pa-2 pr-3 rounded-pill">
    <v-avatar size="40" class="mr-3">
      <v-img
        v-if="invitation.userAvatar"
        :src="invitation.userAvatar"
        :alt="invitation.userName"
        cover
      ></v-img>
      <svg v-else width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#E0E0E0" />
        <circle cx="20" cy="15" r="7" fill="#BDBDBD" />
        <path
          d="M6 34.5C6 27.5964 11.5964 22 18.5 22H21.5C28.4036 22 34 27.5964 34 34.5V40H6V34.5Z"
          fill="#BDBDBD"
        />
      </svg>
    </v-avatar>

    <div class="flex-grow-1">
      <div class="table-caption text-caption">{{ invitation.tableName }}</div>
      <div class="user-caption font-weight-bold">{{ invitation.userName }}</div>
    </div>

    <div class="d-flex">
      <v-btn
        elevation="0"
        color="secondary"
        class="invitation-button text-caption py-2 px-3 rounded-pill mr-2"
        size="small"
        @click="() => emit('dismiss')"
      >
        {{ dismissCaption }}
      </v-btn>
      <v-btn
        elevation="0"
        color="success"
        class="invitation-button text-caption py-2 px-3 rounded-pill"
        size="small"
        @click="() => emit('accept')"
      >
        {{ acceptCaption }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Invitation from '#layouts/malltalk/interfaces/Invitation.js'

defineProps<{
  invitation: Invitation
  acceptCaption: string
  dismissCaption: string
}>()

const emit = defineEmits<{
  (e: 'accept'): void
  (e: 'dismiss'): void
}>()
</script>

<style lang="scss" scoped>
.invitation-item {
  width: 100%;
  background-color: rgb(var(--v-theme-dm-invitation-item-background-color)) !important;

  .user-caption,
  .table-caption {
    color: rgb(var(--v-theme-dm-invitation-item-font-color));
  }

  .invitation-button {
    &.bg-primary {
      background-color: rgb(var(--v-theme-dm-invitation-item-accept-color)) !important;
    }

    &.bg-secondary {
      background-color: rgb(var(--v-theme-dm-invitation-item-dismiss-color)) !important;
    }
  }
}
</style>
