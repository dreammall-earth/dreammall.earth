<template>
  <v-img class="ma-2 pa-1 w-100" :class="classes" :src="Logo" />
</template>

<script lang="ts" setup>
import Logo from '#assets/dreammall-logo.svg'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * size of the logo image
     */
    size?: 'small' | 'medium' | 'large'
  }>(),
  { size: 'medium' },
)

const classes = computed(() => ({
  'logo--large': props.size === 'large',
  'logo--medium': props.size === 'medium',
  'logo--small': props.size === 'small',
}))
</script>

<style scoped lang="scss">
.logo--large {
  max-width: 36em;
}
.logo--medium {
  max-width: 14em;
}
.logo--small {
  max-width: 8em;
}
</style>