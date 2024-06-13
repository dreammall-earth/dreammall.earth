import { useQuery } from '@vue/apollo-composable'
import { watch, ref } from 'vue'

import { JoinMyRoomQueryResult, joinMyRoomQuery } from '#queries/joinMyRoomQuery'

export default function useMyRoom() {
  const { result: joinMyRoomQueryResult, error: joinMyRoomQueryError } =
    useQuery<JoinMyRoomQueryResult>(joinMyRoomQuery, null, {
      prefetch: false,
      fetchPolicy: 'no-cache',
    })

  const roomUrl = ref<string | null>(null)

  watch(joinMyRoomQueryResult, () => {
    if (joinMyRoomQueryResult.value) {
      roomUrl.value = joinMyRoomQueryResult.value.joinMyRoom
    }
  })

  watch(joinMyRoomQueryError, () => {
    if (joinMyRoomQueryError.value) {
      // eslint-disable-next-line no-console
      console.log(joinMyRoomQueryError.value.message)
    }
  })

  return { roomUrl }
}
