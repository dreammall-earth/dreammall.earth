<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedTable v-if="errorMessage === null" :url="tableUrl" @table-closed="onTableClosed" />
      <div v-else class="test-not-found">
        {{ $t('table.notFound') }}
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { onMounted, onUnmounted } from 'vue'

import DefaultLayout from '#layouts/DefaultLayout.vue'
import useDreamMallPanel from '#layouts/dream-mall-panel/useDreamMallPanel'
import EmbeddedTable from '#pages/table/(components)/embedded-table/EmbeddedTable.vue'

defineProps<{
  tableUrl: string | null
  errorMessage: string | null
}>()

const { setMode } = useDreamMallPanel()

onMounted(() => {
  setMode('table-settings')
})

onUnmounted(() => {
  setMode('mall-talk-setup')
})

const onTableClosed = () => navigate('/')
</script>

<style scoped lang="scss">
@use '@style/breakpoints';

.container {
  --bottom-height: 136px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@include breakpoints.respond-to('sm-and-down') {
  .container {
    --bottom-height: 102px;
  }
}
</style>
