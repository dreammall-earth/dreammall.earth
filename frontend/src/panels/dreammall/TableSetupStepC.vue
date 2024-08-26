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
      <v-list
        class="bg-transparent w-100 user-list"
        :class="{ loading: searchUsersStore.isLoading }"
      >
        <UserInvitationItem
          v-for="user in displayedUsers"
          :key="user.id"
          :user="user"
          @update:invited="updateInvitationStatus(user.id, $event)"
        />
      </v-list>
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
import { ref, computed, watch, defineProps } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import UserInvitationItem from '#src/panels/dreammall/components/UserInvitationItem.vue'
import UserInvitation from '#src/panels/dreammall/interfaces/UserInvitation'
import { useSearchUsersStore } from '#stores/searchUsersStore'

import { TableSetupEmits, TableSetupProps } from './TableSetupProps'

const props = defineProps<TableSetupProps>()
const emit = defineEmits<TableSetupEmits>()

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
    invited: invitedUserIdsModel.value.includes(user.id), // todo: user already included in myTable?
  }))
})

const invitedUserIdsModel = computed({
  get: () => props.myTableSettings.users,
  set: (value) => {
    emit('users:updated', value)
  },
})

const updateInvitationStatus = (userId: number, invited: boolean) => {
  let currentUsers: number[] = [...invitedUserIdsModel.value]
  if (invited && !currentUsers.includes(userId)) {
    currentUsers.push(userId)
  } else if (!invited && currentUsers.includes(userId)) {
    currentUsers = currentUsers.filter((id) => id !== userId)
  }
  invitedUserIdsModel.value = currentUsers
}

const onNext = () => {
  emit('next')
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

  &.loading {
    opacity: 50%;
  }
}
</style>
