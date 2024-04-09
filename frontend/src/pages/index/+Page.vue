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
          >{{ $t('buttons.toRoom') }}</v-btn
        >
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { inject } from 'vue'

import DefaultLayout from '#layouts/DefaultLayout.vue'
// eslint-disable-next-line import/no-relative-parent-imports
import { getRoomQuery } from '#queries/getRoomQuery'

const apolloClient = inject<ApolloClient<InMemoryCache>>(DefaultApolloClient)

const enterRoom = async () => {
  try {
    const result = await apolloClient?.query({ query: getRoomQuery, fetchPolicy: 'network-only' })
    window.location.href = result?.data?.getRoom
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('auth error', error.message ? error.message : error)
  }
}
</script>
