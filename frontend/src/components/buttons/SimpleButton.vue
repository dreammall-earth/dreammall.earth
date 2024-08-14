<template>
  <v-btn elevation="0" :prepend-icon="icon" class="custom-green-btn" rounded @click="onClick">
    {{ label }}
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
.custom-green-btn {
  background-color: #4caf50;
  color: white;
  text-transform: none;
  font-weight: normal;
  font-size: 16px;
  height: auto !important;
  padding: 0 20px;
  min-height: 42px; // Adjust this value as needed

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    display: none;
  }

  & :deep(.v-btn__content) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  & :deep(.v-btn__prepend) {
    margin-right: 8px !important;
    margin-bottom: 0 !important;
  }
}
</style>
