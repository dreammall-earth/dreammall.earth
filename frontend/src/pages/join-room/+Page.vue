<template>
  <DefaultLayout>
    <div class="h-screen auth-page py-12">{{ id }}</div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { usePageContext } from '#context/usePageContext'
import DefaultLayout from '#layouts/DefaultLayout.vue'

// import { joinRoomQuery } from '#queries/joinRoomQuery'

const pageContext = usePageContext()
const id = pageContext.routeParams?.id
</script>
