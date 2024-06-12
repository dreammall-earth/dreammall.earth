<template>
  <div><slot /></div>
</template>

<script>
import { defineComponent, provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { MockedProvider } from '@apollo/client/testing'

const apolloClient = new MockedProvider({
  mocks: [
    {
      request: {
        query: joinMyRoomQuery,
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
