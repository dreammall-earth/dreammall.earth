<template>
    <v-text-field
      v-model="modelValue"
      :label="label"
      :prepend-inner-icon="prependInnerIcon"
      :clearable="clearable"
      :flat="flat"
      :loading="loading"
      :rounded="rounded"
      :variant="variant"
      class="mx-4 mt-4 SearchDrawer"
    ></v-text-field>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, defineEmits } from 'vue'
  
  defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Search',
    },
    prependInnerIcon: {
      type: String,
      default: 'mdi-tune',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    density: {
        type: String as () => 'compact' | 'comfortable' | 'default' | 'prominent',
      default: 'comfortable',
    },
    flat: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    variant: {
        type: String as () => 'solo' | 'outlined' | 'filled' | 'underlined',
      default: 'solo',
    },
  })
  
  const emits = defineEmits(['update:modelValue'])
  
  const updateValue = (value: string) => {
    emits('update:modelValue', value)
  }
  </script>
  
  <style scoped>
  
  
  .SearchDrawer {
    border-radius: 25px;
  }
  </style>
  