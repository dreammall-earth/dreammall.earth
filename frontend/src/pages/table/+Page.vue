<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedTable :url="tableUrl" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
 /*
import { useQuery } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
*/

import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import { usePageContext } from '#context/usePageContext'
import DefaultLayout from '#layouts/DefaultLayout.vue'
// import { joinTableQuery } from '#queries/joinTableQuery'

/*
 import {  }

 const {
   result: joinTableQueryResult,
   refetch: joinTableQueryRefetch,
   loading,
 } = useQuery(
   joinTableQuery,
   {
     userName: userName.value,
     tableId,
   },
   {
     prefetch: false,
     fetchPolicy: 'no-cache',
   },
 )
 */

const pageContext = usePageContext()

// const tableId = Number(pageContext.routeParams?.id)

const tableUrl = ''
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

.container {
  --bottom-height: 16px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 85px;
  }
}
</style>
