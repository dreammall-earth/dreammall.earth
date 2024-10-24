<template>
  <div class="invitation-item d-flex align-center pa-2 pr-3 rounded-pill">
    <UserAvatar
      :size="40"
      class="mr-3"
      :name="invitation.userName"
      :avatar-src="invitation.userAvatar"
    />

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
import UserAvatar from '#components/Avatar/UserAvatar.vue'
import Invitation from '#components/malltalk/interfaces/Invitation'

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
