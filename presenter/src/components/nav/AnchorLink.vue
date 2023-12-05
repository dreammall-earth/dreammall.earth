<template>
  <v-btn :class="classes" variant="plain" :href="props.href">
    {{ props.label }}
  </v-btn>
</template>

<script lang="ts" setup>
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
  }>(),
  { href: '#', label: 'Link' },
)

const classes = computed(() => ({
  'anchor-link': true,
}))
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
}
</style>
