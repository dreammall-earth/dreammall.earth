<template>
  <v-btn :color="setColor" :class="classes" :size="size" @click="onClick">
    <v-icon v-if="props.variant === 'reload'" start class="reload-icon" icon="mdi-reload"></v-icon>
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
import { navigate } from 'vike/client/router'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label: string
    href?: string
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
  { href: undefined, variant: 'primary', size: 'medium', isLoading: false },
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

const setColor = computed(() => {
  if (props.variant === 'secondary') {
    return '#767676'
  } else if (props.variant === 'third') {
    return '#3d4753'
  } else if (props.variant === 'third-inverse') {
    return 'transparent'
  } else if (props.variant === 'fourth') {
    return '#2ca5b1'
  } else if (props.variant === 'submit') {
    return '#23ad5b'
  } else if (props.variant === 'download') {
    return '#009dd9'
  } else if (props.variant === 'reload') {
    return '#fff'
  } else {
    return '#f09630'
  }
})

const onClick = () => {
  if (props.href) {
    navigate(props.href)
  }
  emit('click', 1)
}
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.main-button {
  padding: 12px 39px;
  font-family: $font-family-default;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6rem;
  color: white;
  text-align: center;
  border-radius: 80px;
  box-shadow: none;

  &--primary {
    color: white !important;
    background-color: $main-button-primary-background;
  }

  &--primary:hover {
    @include linear-gradient-btn-hover($primary-color, $primary-color-transition);

    box-shadow: 0 6px 24px 0 $main-button-primary-shadow;
  }

  &--secondary {
    color: $main-button-secondary-color;
    background-color: $main-button-secondary-bg;
  }

  &--third {
    padding: 8px 38px;
    background-color: $main-button-third-bg;
    border-radius: 10px;
  }

  &--third-inverse {
    padding: 8px 38px;
    color: $font-color-default;
    background-color: transparent;
    border: 1px solid $font-color-default;
    border-radius: 10px;
  }

  &--fourth {
    padding: 0.75rem 2.4375rem;
    background-color: $main-button-fourth-bg;
  }

  &--fourth:hover {
    @include linear-gradient-btn-hover(
      $main-button-fourth-bg-hover-transition-start,
      $main-button-fourth-bg-hover-transition-end
    );

    box-shadow: 0 6px 24px 0 $main-button-primary-shadow;
  }

  &--form-submit {
    background: $main-button-submit-bg;
    border-radius: 15px;
  }

  &--form-submit:hover {
    @include linear-gradient-btn-hover(
      $main-button-submit-bg-hover-transition-start,
      $main-button-submit-bg-hover-transition-end
    );

    box-shadow: 0 6px 24px 0 $main-button-primary-shadow;
  }

  &--reload {
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 1.1rem */
    color: #bcbcbc;
    background: $background-color-alt;
    border: 1px solid #e3e3e3;
    border-radius: 3.25rem;

    .reload-icon {
      padding-right: 16px;
    }

    &.main-button-small {
      font-size: 70%;

      .reload-icon {
        padding-right: 0;
      }
    }
  }

  &--reload:hover {
    color: #545454;
  }

  &--download {
    background: $main-button-download-bg;
    border-radius: 15px;
  }

  &--download:hover {
    @include linear-gradient-btn-hover(
      $main-button-download-bg-hover-transition-start,
      $main-button-download-bg-hover-transition-end
    );

    box-shadow: 0 6px 24px 0 $main-button-primary-shadow;
  }

  &-large {
    width: 16rem;
    height: auto;
  }

  &-medium {
    width: 8rem;
    height: auto;
  }

  &-small {
    width: 4rem;
    height: auto !important;
    font-size: 100%;
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
