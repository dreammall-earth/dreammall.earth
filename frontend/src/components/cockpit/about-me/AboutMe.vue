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
      @edit-details="() => setMode('edit-details')"
      @edit-social="() => setMode('edit-social')"
      @update-availability="updateAvailability"
      @update-name="updateName"
      @update-introduction="updateIntroduction"
    />
    <EditUserDetails
      v-if="user && mode === 'edit-details'"
      :details="user.details"
      @back="() => setMode('view')"
      @add-detail="addDetail"
      @remove-detail="removeDetail"
    />
    <EditSocialMedia
      v-if="user && mode === 'edit-social'"
      :socials="user.social"
      @back="() => setMode('view')"
      @add-social="addSocial"
      @remove-social="removeSocial"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import ClientOnly from '#components/ClientOnly.vue'
import globalErrorHandler from '#plugins/globalErrorHandler'
import {
  useUserStore,
  UserAvailability,
  AddUserDetailInput,
  AddSocialMediaInput,
} from '#stores/userStore'

import AboutMeView from './AboutMeView.vue'
import EditSocialMedia from './EditSocialMedia.vue'
import EditUserDetails from './EditUserDetails.vue'

type Mode = 'view' | 'edit-details' | 'edit-social'
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

const updateName = async (newName: string) => {
  await userStore.updateUser({
    name: newName,
  })
}

const updateIntroduction = async (newIntroduction: string) => {
  await userStore.updateUser({
    name: user.value!.name,
    introduction: newIntroduction,
  })
}

const addDetail = async (detail: AddUserDetailInput) => {
  await userStore.addUserDetail(detail)
  detail.text = ''
}

const removeDetail = async (detailId: number) => {
  await userStore.removeUserDetail(detailId)
}

const addSocial = async (social: AddSocialMediaInput) => {
  await userStore.addSocialMedia(social)
  social.link = ''
}

const removeSocial = async (socialId: number) => {
  await userStore.removeSocialMedia(socialId)
}
</script>
