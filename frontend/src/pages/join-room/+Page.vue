<template>
  <DefaultLayout>
    <div class="d-flex bg-white text-center pa-6 v-container">
      <v-row class="section-header newsletter-section">
        <v-col>
          <h2 class="section-headline">{{ $t('joinRoomPage.header') }}</h2>
          <div class="mt-8 d-flex justify-center">
            <v-form ref="form" class="w-25" @submit.prevent="getRoomLink">
              <v-text-field
                id="userName"
                v-model="userName"
                class="pb-3"
                :counter="10"
                label="Name"
                hide-details
                required
              ></v-text-field>
              <MainButton
                variant="submit"
                size="auto"
                label="Bestätigen"
                type="submit"
                :is-loading="loading"
              >
              </MainButton>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import { usePageContext } from '#context/usePageContext'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { joinRoomQuery } from '#queries/joinRoomQuery'

const pageContext = usePageContext()
const roomId = Number(pageContext.routeParams?.id)
const userName = ref('')

const form = ref<HTMLFormElement>()
const {
  result: joinRoomQueryResult,
  refetch: joinRoomQueryRefetch,
  loading,
} = useQuery(
  joinRoomQuery,
  {
    userName: userName.value,
    roomId,
  },
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

const getRoomLink = async () => {
  try {
    await joinRoomQueryRefetch()
    if (joinRoomQueryResult.value) {
      window.location.href = joinRoomQueryResult.value.joinRoom
    }
  } catch (error) {
    GlobalErrorHandler.error('room link not found', error)
  }
}
</script>
