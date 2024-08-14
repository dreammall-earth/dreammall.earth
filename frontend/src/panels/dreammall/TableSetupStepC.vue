<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4">
    <v-text-field
      v-model="userSearch"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      label="Suche"
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
    />

    <v-list class="bg-transparent">
      <UserInvitationItem
        v-for="user in users"
        :key="user.id"
        :user="user"
        @update:invited="updateInvitationStatus(user.id, $event)"
      />
    </v-list>

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" label="Weiter" @click="onNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import UserInvitationItem from '#src/panels/dreammall/components/UserInvitationItem.vue'

interface User {
  id: number
  name: string
  avatar: string | null
  invited: boolean
}

const users = ref<User[]>([
  {
    id: 1,
    name: 'Dr. Ally Anderson Langname',
    avatar: null,
    invited: false,
  },
  {
    id: 2,
    name: 'Danny Moore',
    avatar: null,
    invited: true,
  },
])

const updateInvitationStatus = (userId: number, newStatus: boolean) => {
  const user = users.value.find((u) => u.id === userId)
  if (user) {
    user.invited = newStatus
  }
}

const userSearch = ref('')

const emit = defineEmits<{
  (e: 'next'): void
}>()

const onNext = () => {
  emit('next')
}
</script>

<style lang="scss">
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}
</style>
