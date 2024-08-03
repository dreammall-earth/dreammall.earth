<template>
  <ClientOnly>
    <AboutMeView
      v-if="user && mode === 'view'"
      :username="user.username"
      :name="user.name"
      :availability="user.availability"
      :introduction="user.introduction"
      :details="user.details"
      :social="user.social"
      :user-image="avatar"
      :initials="initials"
      @edit="() => setMode('edit')"
      @update-availability="updateAvailability"
      @update-introduction="updateIntroduction"
    ></AboutMeView>
    <AboutMeEdit
      v-if="user && mode === 'edit'"
      :username="user.username"
      :name="user.name"
      :availability="user.availability"
      :introduction="user.introduction"
      :details="user.details"
      :social="user.social"
      @back="() => setMode('view')"
      @add-detail="addDetail"
      @remove-detail="removeDetail"
    ></AboutMeEdit>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import ClientOnly from '#components/ClientOnly.vue'
import globalErrorHandler from '#plugins/globalErrorHandler'
import { useUserStore, UserAvailability, AddUserDetailInput } from '#stores/userStore'

import AboutMeEdit from './AboutMeEdit.vue'
import AboutMeView from './AboutMeView.vue'

type Mode = 'view' | 'edit'
const mode = ref<Mode>('view')

const setMode = (newMode: Mode) => (mode.value = newMode)

const userStore = useUserStore()

const {
  getCurrentUser: user,
  getCurrentUserAvatar: avatar,
  getCurrentUserInitials: initials,
} = storeToRefs(userStore)

const updateAvailability = async (newAvailability: UserAvailability) => {
  try {
    await userStore.updateUser({
      name: user.value!.name,
      availability: newAvailability,
    })
  } catch (error) {
    globalErrorHandler.error(`Could not update user: ${(error as Error).message}`, error)
  }
}

const updateIntroduction = async (newIntroduction: string) => {
  await userStore.updateUser({
    name: user.value!.name,
    introduction: newIntroduction,
  })
}

const addDetail = async (detail: AddUserDetailInput) => {
  await userStore.addUserDetail(detail)
}

const removeDetail = async (detailId: number) => {
  await userStore.removeUserDetail(detailId)
}
</script>
