import { useMutation, useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import {
  addSocialMediaMutation,
  AddSocialMediaInput,
  AddSocialMediaMutationResult,
} from '#mutations/addSocialMediaMutation'
import {
  addUserDetailMutation,
  AddUserDetailInput,
  AddUserDetailMutationResult,
} from '#mutations/addUserDetailMutation'
import { removeSocialMediaMutation } from '#mutations/removeSocialMediaMutation'
import { removeUserDetailMutation } from '#mutations/removeUserDetailMutation'
import {
  updateUserMutation,
  UpdateUserInput,
  UpdateUserMutationResult,
} from '#mutations/updateUserMutation'
import { currentUserQuery } from '#queries/currentUserQuery'

export type { AddSocialMediaInput } from '#mutations/addSocialMediaMutation'
export type { AddUserDetailInput } from '#mutations/addUserDetailMutation'

export type UserInTable = {
  id: number
  role: 'VIEWER' | 'MODERATOR'
  name: string
  username: string
}

export type MyTable = {
  id: number
  name: string
  public: boolean
  users: UserInTable[]
}

export type UserDetailCategory = 'place' | 'work' | 'language' | 'education' | 'feeling'

export type UserDetail = {
  id: number
  category: UserDetailCategory
  text: string
}

export type UserAvailability = null | 'available' | 'partly_available' | 'busy'

export type SocialMedia = {
  id: number
  type: string
  link: string
}

export type CurrentUser = {
  id: number
  name: string
  username: string
  avatar?: string
  table?: MyTable
  introduction?: string
  availability: UserAvailability
  details: UserDetail[]
  social: SocialMedia[]
}

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref<CurrentUser | null>(null)

    const { result: currentUserQueryResult, loading } = useQuery(
      currentUserQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(currentUserQueryResult, (data: { currentUser: CurrentUser }) => {
      setCurrentUser(data.currentUser)
    })

    const getCurrentUser = computed(() => currentUser.value)

    const getMyTable = computed(() => currentUser.value?.table)

    const getUsersInMyTable = computed(() => currentUser.value?.table?.users)

    const getCurrentUserAvatar = computed(() => currentUser.value?.avatar)

    const getCurrentUserInitials = computed(() => {
      const name = currentUser.value?.name
      if (name)
        return name
          .split(' ')
          .map((n) => n.charAt(0))
          .join('')
      return ''
    })

    const setCurrentUser = (user: CurrentUser) => {
      currentUser.value = user
    }

    const { mutate: updateUserMutationResult } = useMutation<UpdateUserMutationResult>(
      updateUserMutation,
      {
        fetchPolicy: 'no-cache',
      },
    )

    const updateUser = async (data: UpdateUserInput) => {
      const result = await updateUserMutationResult({ data })
      if (result?.data) {
        setCurrentUser(result.data.updateUser)
      }
    }

    const { mutate: addUserDetailMutationResult } = useMutation<AddUserDetailMutationResult>(
      addUserDetailMutation,
      {
        fetchPolicy: 'no-cache',
      },
    )

    const addUserDetail = async (userDetail: AddUserDetailInput) => {
      const result = await addUserDetailMutationResult({ data: userDetail })
      if (result?.data && currentUser.value?.id) {
        setCurrentUser({
          ...currentUser.value,
          details: [...currentUser.value.details, result.data.addUserDetail],
        })
      }
    }

    const { mutate: removeUserDetailMutationResult } = useMutation(removeUserDetailMutation, {
      fetchPolicy: 'no-cache',
    })

    const removeUserDetail = async (userDetailId: number) => {
      await removeUserDetailMutationResult({ id: userDetailId })
      if (currentUser.value?.id) {
        setCurrentUser({
          ...currentUser.value,
          details: currentUser.value.details.filter((d) => d.id !== userDetailId),
        })
      }
    }

    const { mutate: AddSocialMediaMutationResult } = useMutation<AddSocialMediaMutationResult>(
      addSocialMediaMutation,
      {
        fetchPolicy: 'no-cache',
      },
    )

    const addSocialMedia = async (socialMedia: AddSocialMediaInput) => {
      const result = await AddSocialMediaMutationResult({ data: socialMedia })
      if (result?.data && currentUser.value?.id) {
        setCurrentUser({
          ...currentUser.value,
          social: [...currentUser.value.social, result.data.addSocialMedia],
        })
      }
    }

    const { mutate: removeSocialMediaMutationResult } = useMutation(removeSocialMediaMutation, {
      fetchPolicy: 'no-cache',
    })

    const removeSocialMedia = async (socialMediaId: number) => {
      await removeSocialMediaMutationResult({ id: socialMediaId })
      if (currentUser.value?.id) {
        setCurrentUser({
          ...currentUser.value,
          social: currentUser.value.social.filter((s) => s.id !== socialMediaId),
        })
      }
    }

    return {
      loading,
      currentUser,
      getCurrentUser,
      setCurrentUser,
      getCurrentUserInitials,
      getCurrentUserAvatar,
      getMyTable,
      getUsersInMyTable,
      updateUser,
      addUserDetail,
      addSocialMedia,
      removeUserDetail,
      removeSocialMedia,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
