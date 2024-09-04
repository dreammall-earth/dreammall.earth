<template>
  <v-text-field
    v-model="userSearch"
    rounded
    clearable
    class="elevation-0 w-100"
    content-class="elevation-0"
    label="Suche"
    variant="solo-filled"
    append-inner-icon="mdi-magnify"
  />

  <div class="user-list-container w-100">
    <div v-if="error" class="text-center text-error">
      {{ $t('dream-mall-panel.setup.search-error') }}
    </div>

    <v-list
      v-if="displayedUsers.length"
      class="bg-transparent w-100 user-list"
      :class="{ loading: isLoading }"
    >
      <UserInvitationItem
        v-for="user in displayedUsers"
        :key="user.id"
        :user="user"
        @update:invited="updateInvitationStatus(user.id, $event)"
      />
    </v-list>

    <div v-if="!displayedUsers.length" class="text-center mt-4 text-grey-darken-2">
      {{ $t('dream-mall-panel.setup.no-result') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import UserInvitationItem from '#src/panels/components/UserInvitationItem.vue'
import useSearchUsers from '#src/panels/composables/useSearchUsers'
import UserInvitation from '#src/panels/dreammall/interfaces/UserInvitation'

const users = defineModel<number[]>({ required: true })

const { searchUsers, searchResults, isLoading, error } = useSearchUsers()
const userSearch = ref('')

watch(userSearch, (newSearch) => {
  searchUsers(newSearch)
})

const displayedUsers = computed<UserInvitation[]>(() => {
  return searchResults.value.map((user) => ({
    id: user.id,
    name: user.name || user.username,
    avatar: null, // not supporting yet
    invited: users.value.includes(user.id), // todo: user already included in myTable?
  }))
})

const updateInvitationStatus = (userId: number, invited: boolean) => {
  let currentUsers: number[] = [...users.value]
  if (invited && !currentUsers.includes(userId)) {
    currentUsers.push(userId)
  } else if (!invited && currentUsers.includes(userId)) {
    currentUsers = currentUsers.filter((id) => id !== userId)
  }
  users.value = currentUsers
}
</script>

<style lang="scss" scoped>
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}

.user-list-container {
  height: 200px;
  overflow-y: auto;

  .user-list {
    height: 100%;

    &.loading {
      opacity: 0.5;
      transition: opacity 0.5s ease;
    }
  }
}
</style>
