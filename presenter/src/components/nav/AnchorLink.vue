<template>
  <v-btn :class="classes" variant="plain" :href="props.href" @click.prevent="onClick">
    {{ props.label }}
  </v-btn>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the anchor
     */
    label: string
    /**
     * The href of the anchor
     */
    href: string
    /**
     * variant of anchor element
     */
    variant?: 'default' | 'text'
  }>(),
  { href: '#', label: 'Link', variant: 'default' },
)

const classes = computed(() => ({
  'anchor-link': true,
  'anchor-link--text': props.variant === 'text',
}))

function onClick() {
  return navigate(props.href)
}
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.anchor-link {
  @include anchor-font;

  padding-right: 0;
  padding-left: 0;
  text-align: center;
  text-transform: unset !important;
  letter-spacing: 0;

  &:hover {
    font-weight: 400;
    color: $font-color-anchor-text-hover;
  }

  &--active {
    font-weight: 400;
    color: $font-color-anchor-text-active;
  }

  &--text {
    @include text-font-small($font-color-link-text);
  }
}
</style>
