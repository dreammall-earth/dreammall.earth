<template>
  <v-app :theme="themeName" :style="{ height: appHeight }">
    <v-main>
      <slot name="story"></slot>
    </v-main>
  </v-app>
</template>

<script>
export const DEFAULT_THEME = 'light'
export const DEFAULT_HEIGHT = 'auto' // Fallback height

export default {
  props: {
    themeName: {
      default: DEFAULT_THEME,
      type: String,
    },
    appHeight: {
      default: DEFAULT_HEIGHT,
      type: String,
    },
  },
}
</script>

<style>
.v-application .v-application__wrap {
  min-height: unset;
}
</style>


