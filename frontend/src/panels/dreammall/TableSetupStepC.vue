<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
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

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="submitText" @click="onNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import UserInvitationItem from '#src/panels/dreammall/components/UserInvitationItem.vue'
import useSearchUsers from '#src/panels/dreammall/composable/useSearchUsers'
import UserInvitation from '#src/panels/dreammall/interfaces/UserInvitation'

import { TableSetupEmits, TableSetupProps } from './TableSetupProps'

const props = defineProps<TableSetupProps>()
const emit = defineEmits<TableSetupEmits>()

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
      opacity: 50%;
      transition: opacity 0.5s ease;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>
