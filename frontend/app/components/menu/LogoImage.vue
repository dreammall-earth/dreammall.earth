<template>
  <v-img class="w-100" :class="classes" :src="textEnabled ? Logo : LogoSimple" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import LogoSimple from '#assets/dreammall-logo-simple.svg'
import Logo from '#assets/dreammall-logo.svg'

const props = withDefaults(
  defineProps<{
    /**
     * size of the logo image
     */
    size?: 'small' | 'medium' | 'large' | 'tiny'
    textEnabled?: boolean
  }>(),
  { size: 'medium', textEnabled: true },
)

const classes = computed(() => ({
  'logo-large': props.size === 'large',
  'logo-medium': props.size === 'medium',
  'logo-small': props.size === 'small',
  'logo-tiny': props.size === 'tiny',
}))
</script>

<style scoped lang="scss">
.logo-large {
  max-width: 36em;
}

.logo-medium {
  max-width: 14em;
}

.logo-small {
  max-width: 8em;
}

.logo-tiny {
  max-width: 2em;
}
</style>
