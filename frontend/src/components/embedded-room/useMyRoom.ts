import { useMutation } from '@vue/apollo-composable'
import { watch, ref } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { JoinMyRoomMutationResult, joinMyRoomMutation } from '#mutations/joinMyRoomMutation'

export default async function useMyRoom() {
  const { mutate: joinMyRoomMutationResult, error: joinMyRoomMutationError } =
    useMutation<JoinMyRoomMutationResult>(joinMyRoomMutation, {
      fetchPolicy: 'no-cache',
    })
  
  const roomUrl = ref<string | null>(null)

  const result = await joinMyRoomMutationResult()

  if (result?.data) {
    roomUrl.value = result.data.joinMyRoom
  }

  watch(joinMyRoomMutationError, () => {
    if (joinMyRoomMutationError.value) {
      GlobalErrorHandler.error(joinMyRoomMutationError.value.message)
    }
  })

  return { roomUrl }
}
