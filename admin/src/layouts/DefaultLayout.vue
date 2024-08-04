<template>
  <v-main class="bg-grey-lighten-3">
    <slot />
  </v-main>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>
