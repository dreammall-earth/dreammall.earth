<template>
  <v-btn :class="classes" :style="style" :size="size" @click="onClick">{{ label }}</v-btn>
</template>

<script lang="ts" setup>
// eslint-disable-next-line import/no-unassigned-import

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
    /**
     * background color of the button
     */
    // backgroundColor?: string
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
  [`main-button--${props.size || 'medium'}`]: true,
}))

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}))

const onClick = () => {
  emit('click', 1)
}
</script>

<style scoped lang="scss">
.main-button{ 
  padding: 12px 39px;
  color: white;
  font-family: "Poppins";
  font-weight: 600;
  text-align: center;
  line-height: 1.6rem;
  font-size: 1.25rem;
  border-radius: 80px;

  &--primary{
    background-color: #F09630;
  }
  &--secondary{
    background-color: #fff;
    color: #767676;
  }
  &--third{
    padding: 8px 38px;
    border-radius: 10px;
    background-color: #3D4753;
  }
  &--third-inverse{
    padding: 8px 38px;
    border-radius: 10px;
    background-color: transparent;
    border: 1px solid #3D4753;
    color: #3D4753;
  }

  &--large{
    width: 16rem;
  }
  &--medium{
    width: 8rem;
  }
  &--small{
    width: 4rem;
  }
}
</style>