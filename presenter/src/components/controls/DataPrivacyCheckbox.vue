<template>
  <v-checkbox
    v-model="dataprivacy"
    name="dataprivacy"
    color="rgba(174, 179, 189, 0.50)"
    value="false"
    hide-details="auto"
    :center-affix="false"
    density="compact"
    required
    :rules="[() => !!dataprivacy || $t('validation.fieldRequired')]"
    @update:model-value="emit('modelValue:update', dataprivacy)"
  >
  </v-checkbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dataprivacy = ref(0)

const emit = defineEmits<{
  (e: 'modelValue:update', dataprivacy: number): void
}>()
</script>
