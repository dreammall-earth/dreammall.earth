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
  color: #3d4753;
  text-transform: unset !important;
  font-weight: 300;
  text-align: center;
  line-height: 1.9rem;
  font-size: 1.25rem;
  letter-spacing: 0em;
  padding-left: 0;
  padding-right: 0;
  font-family: 'Poppins';

  &:hover {
    color: #3f454d;
    font-weight: 400;
  }

  &--active {
    color: rgb(121, 121, 121);
    font-weight: 400;
  }
}
</style>