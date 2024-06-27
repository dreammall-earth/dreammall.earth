<template>
  <DefaultLayout>
    <create-button />
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { useSubscription } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { watch } from 'vue'

import CreateButton from '#components/buttons/CreateButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'

const { result } = useSubscription(gql`
  subscription {
    updateOpenRooms
  }
`)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
watch(result, (data: any) => {
  // eslint-disable-next-line no-console
  console.log('Subscription received:', data)
})
</script>
