<template>
  <div><slot /></div>
</template>

<script lang="ts">
 import { defineComponent, provide } from 'vue'
 import { DefaultApolloClient } from '@vue/apollo-composable'

 import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
 import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
 import { MockedProvider } from '@apollo/client/testing'

 const apolloClient = new MockedProvider({
   mocks: [
     {
       request: {
         query: joinMyTableMutation,
       },
       result: {
         data: {
           joinMyTable: 69,
         },
       },
     },
     {
       request: {
         query: openTablesQuery,
       },
       result: {
         data: {
           openTables: [
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
