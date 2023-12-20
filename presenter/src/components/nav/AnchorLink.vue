<template>
  <v-btn :class="classes" variant="plain" :href="props.href" @click.prevent="onClick()">
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

async function onClick() {
  const navigationPromise = navigate('/#products')
  await navigationPromise
}
</script>

<style scoped lang="scss">
.anchor-link {
  padding-right: 0;
  padding-left: 0;
  font-family: Poppins, sans-serif;
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.9rem;
  color: #3d4753;
  text-align: center;
  text-transform: unset !important;
  letter-spacing: 0;

  &:hover {
    font-weight: 400;
    color: #3f454d;
  }

  &--active {
    font-weight: 400;
    color: rgb(121 121 121);
  }

  &--text {
    font-family: Poppins, sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    color: #009dd9;
  }
}
</style>
