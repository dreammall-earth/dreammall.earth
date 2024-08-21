<template>
  <div class="d-flex bg-white text-center pa-6 v-container">
    <v-row class="section-header newsletter-section">
      <v-col>
        <h2 class="section-headline">{{ $t('joinTablePage.header') }}</h2>
        <div class="mt-8 d-flex justify-center">
          <v-form ref="form" class="w-25" @submit.prevent="getTableLink">
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
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import { usePageContext } from '#context/usePageContext'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { joinTableAsGuestQuery } from '#queries/joinTableAsGuestQuery'

const pageContext = usePageContext()
const tableId = Number(pageContext.routeParams?.id)
const userName = ref('')

const form = ref<HTMLFormElement>()
const {
  result: joinTableAsGuestQueryResult,
  refetch: joinTableAsGuestQueryRefetch,
  loading,
} = useQuery(
  joinTableAsGuestQuery,
  {
    userName: userName.value,
    tableId,
  },
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

const getTableLink = async () => {
  try {
    await joinTableAsGuestQueryRefetch({
      userName: userName.value,
      tableId,
    })
    if (joinTableAsGuestQueryResult.value) {
      window.location.href = joinTableAsGuestQueryResult.value.joinTableAsGuest
    }
  } catch (error) {
    GlobalErrorHandler.error('table link not found', error)
  }
}
</script>
