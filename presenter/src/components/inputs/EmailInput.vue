<template>
  <v-text-field
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
    type="email"
    :required="props.required"
    :rules="emailRules"
    @update:model-value="emit('update:modelValue', $event)"
  ></v-text-field>
</template>

<script lang="ts" setup>
import { emailRules } from '#src/validation/validation'

const props = withDefaults(
  defineProps<{
    modelValue: string
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
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'modelValue:updateupdate:modelValue', event: string): void
}>()
</script>
