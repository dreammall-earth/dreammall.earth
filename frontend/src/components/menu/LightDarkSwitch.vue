<template>
  <v-switch
    :label="`${$t('menu.theme.light')} / ${$t('menu.theme.dark')}`"
    @click="toggleTheme"
    class="light-dark-switch align-center justify-center px-1"
  ></v-switch>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style lang="scss">
.light-dark-switch {
  label {
    opacity: 1 !important;
  }
}
</style>
