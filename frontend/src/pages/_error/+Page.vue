<template>
  <DefaultLayout>
    <div v-if="is404">
      <h1>{{ $t('error.404.h1') }}</h1>
      <p>{{ $t('error.404.text') }}</p>
    </div>
    <div v-else>
      <h1>{{ $t('error.500.h1') }}</h1>
      <p>{{ $t('error.500.text') }}</p>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'

defineProps({ is404: Boolean })
</script>
