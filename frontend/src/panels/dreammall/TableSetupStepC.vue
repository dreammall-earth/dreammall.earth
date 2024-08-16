<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-text-field
      v-model="userSearch"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      label="Suche"
      variant="solo-filled"
      append-inner-icon="mdi-magnify"
    />

    <div class="user-list-container w-100">
      <v-list class="bg-transparent w-100 user-list">
        <UserInvitationItem
          v-for="user in displayedUsers"
          :key="user.id"
          :user="user"
          @update:invited="updateInvitationStatus(user.id, $event)"
        />
      </v-list>
    </div>

    <div v-if="searchUsersStore.isLoading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-if="searchUsersStore.error" class="text-center text-error">
      An error occurred while searching for users.
    </div>

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" label="Weiter" @click="onNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import UserInvitationItem from '#src/panels/dreammall/components/UserInvitationItem.vue'
import UserInvitation from '#src/panels/dreammall/interfaces/UserInvitation'
import { useSearchUsersStore } from '#stores/searchUsersStore'

// const tablesStore = useTablesStore()

const searchUsersStore = useSearchUsersStore()
const userSearch = ref('')

watch(userSearch, (newSearch) => {
  searchUsersStore.searchUsers(newSearch)
})

const displayedUsers = computed<UserInvitation[]>(() => {
  return searchUsersStore.searchResults.map((user) => ({
    id: user.id,
    name: user.name || user.username,
    avatar: null, // not supporting yet
    invited: invitedUserIds.value.includes(user.id), // todo: user already included in myTable?
  }))
})

const invitedUserIds = ref<number[]>([])

const updateInvitationStatus = (userId: number, invited: boolean) => {
  if (invited && !invitedUserIds.value.includes(userId)) {
    invitedUserIds.value.push(userId)
  } else if (!invited && invitedUserIds.value.includes(userId)) {
    invitedUserIds.value = invitedUserIds.value.filter((id) => id !== userId)
  }
}

const emit = defineEmits<{
  (e: 'next'): void
}>()

const onNext = async () => {
  await createMyTable()
  emit('next')
}

const createMyTable = async () => {
  // try {
  //
  // } catch (error) {
  //   GlobalErrorHandler.error('Error opening table', error)
  // }
}
</script>

<style lang="scss">
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}

.user-list-container {
  height: 200px;
  overflow-y: auto;
}
.user-list {
  height: 100%;
}
</style>
