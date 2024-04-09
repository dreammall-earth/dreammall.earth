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
import { useQuery } from '@vue/apollo-composable'

import DefaultLayout from '#layouts/DefaultLayout.vue'
// eslint-disable-next-line import/no-relative-parent-imports
import { getRoomQuery } from '#queries/getRoomQuery'

const { result, refetch } = useQuery(getRoomQuery, null, { fetchPolicy: 'network-only' })

const enterRoom = async () => {
  try {
    refetch()
    window.location.href = result.value.getRoom
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}
</script>
