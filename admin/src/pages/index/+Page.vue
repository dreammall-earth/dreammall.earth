<template>
  <DefaultLayout>
    <div class="mt-5 text-center">
      <h1>{{ $t('index.header') }}</h1>
      <v-link>
        <v-card class="mt-5" href="/app">
          <v-card-title> {{ $t('users.header') }} </v-card-title>
        </v-card>
      </v-link>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
</script>
