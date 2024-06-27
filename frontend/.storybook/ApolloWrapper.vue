<template>
  <div><slot /></div>
</template>

<script lang="ts">
 import { defineComponent, provide } from 'vue'
 import { DefaultApolloClient } from '@vue/apollo-composable'

 import { joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
 import { openRoomsQuery } from '#src/graphql/queries/openRoomsQuery'
 import { MockedProvider } from '@apollo/client/testing'

 const apolloClient = new MockedProvider({
   mocks: [
     {
       request: {
         query: joinMyRoomMutation,
       },
       result: {
         data: {
           joinMyRoom: 'https://meet.jit.si/room',
         },
       },
     },
     {
       request: {
         query: openRoomsQuery,
       },
       result: {
         data: {
           openRooms: [
             {
               meetingID: 'my-meeting',
               meetingName: 'my meeting',
               startTime: '1234',
               participantCount: 1,
               attendees: [
                 {
                   fullName: 'Peter Lustig',
                 },
               ],
               joinLink: 'https://my.link',
             },
           ]
         },
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
