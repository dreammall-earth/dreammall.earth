<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-text-field
      v-model="tableName"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      label="Tischname"
      variant="solo-filled"
      append-inner-icon="mdi-pencil"
      maxlength="64"
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch v-model="isPrivate" label="Privat" color="#4caf50" inset hide-details />

    <SimpleButton class="mt-12" label="Weiter" @click="onNext" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const onNext = () => emit('next')

const tableName = ref('Hardi Hard 01')
const isPrivate = ref(false)
</script>

<style lang="scss">
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}
</style>
