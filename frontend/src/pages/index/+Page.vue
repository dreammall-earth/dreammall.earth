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
          >{{ $t('buttons.signout') }}</v-btn
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
import { getRoom } from '#queries/getRoom'

const apolloClient = inject<ApolloClient<InMemoryCache>>(DefaultApolloClient)

const enterRoom = async () => {
  try {
    const result = await apolloClient?.query({ query: getRoom })
    // eslint-disable-next-line no-console
    console.log(`Redirect to ${result?.data?.getRoom}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error secret', error)
  }
}
</script>
