<template>
  <div class="sidebar">
    <div class="close">
      <v-btn icon variant="text" size="small" @click="$emit('close')">
        <v-icon icon="mdi-close" />
      </v-btn>
    </div>
    <v-avatar :size="55" class="avatar mb-2 text-font">
      <span>{{ getInitials(props.profile.name) }}</span>
    </v-avatar>
    <h3>{{ props.profile.name }}</h3>
    <UserDetails :details="props.profile.details" />
  </div>
</template>

<script lang="ts" setup>
import UserDetails from '#components/cockpit/about-me/UserDetails.vue'
import { getInitials } from '#src/utils/getInitials'

import type { UserWithProfile } from '#stores/userStore'

const props = defineProps<{
  profile: UserWithProfile
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.sidebar {
  border-radius: 15px 0px 0px 15px;
  background: rgba(61, 71, 83, 0.75);
  backdrop-filter: blur(15px);
  display: flex;
  flex-flow: column;
  align-items: center;
  position: fixed;
  right: 0;
  top: 90px;
  width: min(350px, 100vw);
  height: 100%;
  z-index: 200;
}

.close {
  display: flex;
  width: 100%;
  padding: 8px 16px;
  place-content: flex-start flex-start;
  justify-content: flex-end;
  align-items: flex-start;
}
</style>
