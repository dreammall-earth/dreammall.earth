<template>
  <div><slot /></div>
</template>

<script>
import { defineComponent, provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { joinMyRoomMutation } from '#queries/joinMyRoomMutation'
import { MockedProvider } from '@apollo/client/testing'

const apolloClient = new MockedProvider({
  mocks: [
    {
      request: {
        mutation: joinMyRoomMutation,
      },
      result: {
        data: {
          joinMyRoom: 'https://meet.jit.si/room',
        },
        joinMyRoom: 'https://meet.jit.si/room',
      },
    },
  ],
})

export default defineComponent({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
})
</script>
