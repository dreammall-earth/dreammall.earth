<template>
  <v-text-field
    ref="inputField"
    :model-value="props.modelValue"
    :name="props.name"
    :class="props.class"
    :label="props.label"
    :variant="props.variant"
    :color="props.color"
    :bg-color="props.bgColor"
    :hide-details="props.hideDetails"
    :flat="props.flat"
    :rounded="props.rounded"
    :type="props.type"
    :required="props.required"
    :rules="nameRules"
    @update:model-value="emit('update:modelValue', $event)"
  ></v-text-field>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { nameRules } from '#src/validation/validation'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    name?: string
    class?: string
    label?: string
    variant?:
      | 'filled'
      | 'outlined'
      | 'plain'
      | 'underlined'
      | 'solo'
      | 'solo-inverted'
      | 'solo-filled'
      | undefined
    color?: string
    bgColor?: string
    hideDetails?: boolean | 'auto' | undefined
    flat?: boolean
    rounded?: string | boolean
    type?: string
    required?: boolean
  }>(),
  {
    name: undefined,
    class: undefined,
    label: undefined,
    variant: 'solo',
    color: '#3D4753',
    bgColor: 'rgba(174, 179, 189, 0.50)',
    hideDetails: 'auto',
    flat: true,
    rounded: 'xl',
    type: 'text',
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', event: string): void
}>()

const inputField = ref()
const focusInput = () => {
  if (inputField.value) {
    inputField.value.focus()
  }
}
defineExpose({
  inputField,
  focusInput,
})
</script>
