<template>
  <v-btn @click="toggleTheme">{{
    theme.global.current.value.dark ? $t('menu.theme.light') : $t('menu.theme.dark')
  }}</v-btn>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
