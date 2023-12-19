<template>
  <v-btn :class="classes" :size="size" @click="onClick">
    <v-icon v-if="props.variant === 'reload'" start class="pr-4" icon="mdi-reload"></v-icon>
    <span class="main-button-content"
      >{{ label }}
      <v-progress-circular
        v-if="props.isLoading"
        indeterminate="disable-shrink"
        width="1"
        size="15"
        class="btn-loading"
      ></v-progress-circular
    ></span>
  </v-btn>
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
    variant?:
      | 'primary'
      | 'secondary'
      | 'third'
      | 'third-inverse'
      | 'fourth'
      | 'submit'
      | 'download'
      | 'reload'
    /**
     * size of the button
     */
    size?: 'small' | 'medium' | 'large' | 'auto'
    /**
     * show loading animation
     */
    isLoading?: boolean
  }>(),
  { variant: 'primary', size: 'medium', isLoading: false },
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
  'main-button--reload': props.variant === 'reload',
  [`main-button-${props.size}`]: true,
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

  &--primary:hover {
    background: linear-gradient(98deg, #f09630 8.53%, rgb(75 84 96 / 69%) 107.12%);
    box-shadow: 0 6px 24px 0 rgb(64 74 86 / 20%);
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

  &--fourth:hover {
    background: linear-gradient(98deg, #009dd9 8.53%, rgb(75 84 96 / 69%) 107.12%);
    box-shadow: 0 6px 24px 0 rgb(64 74 86 / 20%);
  }

  &--form-submit {
    background: #23ad5b;
    border-radius: 15px;
  }

  &--form-submit:hover {
    background: linear-gradient(98deg, #23ad5b 8.53%, rgb(75 84 96 / 69%) 107.12%);
    box-shadow: 0 6px 24px 0 rgb(64 74 86 / 20%);
  }

  &--reload {
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 1.1rem */
    color: #bcbcbc;
    background: #fff;
    border: 1px solid #e3e3e3;
    border-radius: 3.25rem;
  }

  &--reload:hover {
    color: #545454;
  }

  &--download {
    background: #009dd9;
    border-radius: 15px;
  }

  &--download:hover {
    background: linear-gradient(98deg, #009dd9 8.53%, rgb(75 84 96 / 69%) 107.12%);
    box-shadow: 0 6px 24px 0 rgb(64 74 86 / 20%);
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

  .main-button-content {
    position: relative;

    .btn-loading {
      position: absolute;
      top: 4px;
      right: -20px;
    }
  }
}
</style>
