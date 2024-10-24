<template>
  <v-list-item class="invitation-item my-2 pa-2 pr-3 rounded-pill" elevation="0" rounded>
    <template #prepend>
      <UserAvatar :size="40" :name="user.name" :avatar-src="user.avatar" />
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
        @click="toggleInvitation"
      >
        {{
          user.invited
            ? $t('dream-mall-panel.setup.invitation-sent')
            : $t('dream-mall-panel.setup.invite')
        }}
      </v-btn>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import UserAvatar from '#components/Avatar/UserAvatar.vue'

import type UserInvitation from './UserInvitation'

const props = defineProps<{
  user: UserInvitation
}>()

const emit = defineEmits<{
  (e: 'update:invited', value: boolean): void
}>()

const toggleInvitation = () => {
  emit('update:invited', !props.user.invited)
}
</script>

<style lang="scss" scoped>
.invitation-item {
  --invitation-item-background: #5d6670; // todo: save globally
  --background-invitation-button: #8b949b; // todo: save globally

  background-color: var(--invitation-item-background) !important;

  .invitation-button {
    &.bg-secondary {
      background-color: var(--background-invitation-button) !important;
    }
  }
}
</style>
