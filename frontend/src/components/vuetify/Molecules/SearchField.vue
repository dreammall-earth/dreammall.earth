<template>
  <v-text-field
    v-model="internalValue"
    :label="label"
    :prepend-inner-icon="prependInnerIcon"
    clearable
    :flat="flat"
    rounded
    :variant="variant"
    class="mx-4 mt-4 SearchDrawer"
  ></v-text-field>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
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
const internalValue = ref(props.modelValue)
watch(internalValue, (newValue) => {
  emits('update:modelValue', newValue)
})
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
)
</script>

<style scoped>
.SearchDrawer {
  border-radius: 25px;
}
</style>
