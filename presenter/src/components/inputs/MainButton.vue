<template>
  <v-btn :class="classes" :size="size" @click="onClick">{{ label }}</v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label: string
    /**
     * primary or secondary button
     */
    variant?: 'primary' | 'secondary' | 'third' | 'third-inverse'
    /**
     * size of the button
     */
    size?: 'small' | 'medium' | 'large'
  }>(),
  { variant: 'primary', size: 'medium' },
)

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const classes = computed(() => ({
  'main-button': true,
  'main-button--primary': props.variant === 'primary',
  'main-button--secondary': props.variant === 'secondary',
  'main-button--third': props.variant === 'third',
  'main-button--third-inverse': props.variant === 'third-inverse',
  'main-button--fourth': props.variant === 'fourth',
  'main-button--form-submit': props.variant === 'submit',
  'main-button--download': props.variant === 'download',
  [`main-button-${props.size || 'medium'}`]: true,
}))

const onClick = () => {
  emit('click', 1)
}
</script>

<style scoped lang="scss">
.main-button {
  padding: 12px 39px;
  font-family: Poppins, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6rem;
  color: white;
  text-align: center;
  border-radius: 80px;

  &--primary {
    background-color: #f09630;
  }

  &--secondary {
    color: #767676;
    background-color: #fff;
  }

  &--third {
    padding: 8px 38px;
    background-color: #3d4753;
    border-radius: 10px;
  }

  &--third-inverse {
    padding: 8px 38px;
    color: #3d4753;
    background-color: transparent;
    border: 1px solid #3d4753;
    border-radius: 10px;
  }

  &--fourth {
    padding: 0.75rem 2.4375rem;
    background-color: #2ca5b1;
  }

  &--form-submit {
    background: #23ad5b;
    border-radius: 15px;
  }

  &--download {
    background: #009dd9;
    border-radius: 15px;
  }

  &-large {
    width: 16rem;
  }

  &-medium {
    width: 8rem;
  }

  &-small {
    width: 4rem;
  }

  &-auto {
    width: auto;
  }
}
</style>
