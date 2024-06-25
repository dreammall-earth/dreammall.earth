import { useMutation } from '@vue/apollo-composable'
import { watch, ref } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { JoinMyRoomMutationResult, joinMyRoomMutation } from '#mutations/joinMyRoomMutation'

export default async function useMyRoom() {
  const { mutate: joinMyRoomMutationResult } =
    useMutation<JoinMyRoomMutationResult>(joinMyRoomMutation, {
      fetchPolicy: 'no-cache',
    })
  
  const roomUrl = ref<string | null>(null)

  try {
    console.log('Trying')
    const result = await joinMyRoomMutationResult()
    if (result?.data) {
      roomUrl.value = result.data.joinMyRoom
    }
  } catch (err) {
    GlobalErrorHandler.error('Error on joining my room', err)
  }
    
  return { roomUrl }
}
