<template>
  <DefaultLayout>
    <h1 class="d-flex justify-center">{{ $t('cafe.welcome') }}</h1>
    <v-row>
      <v-col>
        <MainButton
          class="room-button"
          variant="fourth"
          label="To Room"
          size="auto"
          @click="enterRoom"
          >{{ $t('buttons.toRoom') }}</MainButton
        >
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { inject } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { getRoomQuery } from '#queries/getRoomQuery'

const apolloClient = inject<ApolloClient<InMemoryCache>>(DefaultApolloClient)

const enterRoom = async () => {
  try {
    const result = await apolloClient?.query({ query: getRoomQuery, fetchPolicy: 'network-only' })
    window.location.href = result?.data?.getRoom
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}
</script>
