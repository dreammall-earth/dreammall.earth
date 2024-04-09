<template>
  <DefaultLayout>
    <v-row>
      <v-col>
        <v-btn
          class="room-button"
          variants="outlined"
          label="To Room"
          size="auto"
          @click="enterRoom"
        >{{ $t('buttons.signout') }}</v-btn>
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script lang="ts" setup>
 import { DefaultApolloClient, useQuery } from '@vue/apollo-composable'
 import { ApolloClient, InMemoryCache } from '@apollo/client/core'
 import { querySecret } from '#queries/querySecret'

 
 import DefaultLayout from '#layouts/DefaultLayout.vue'
 
 
 const enterRoom = () => {
   console.log(`Redirect to ${}`)
 }
</script>
