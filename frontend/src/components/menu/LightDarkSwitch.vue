<template>
  <Switch
    class="light-dark-switch"
    @change="setTheme"
    :defaultState="theme.global.current.value.dark ? 'right' : 'left'"
    :label="`${$t('menu.theme.light')} / ${$t('menu.theme.dark')}`"
  />
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

import Switch, { State } from '#components/switch/Switch.vue'

const theme = useTheme()

function setTheme(value: State) {
  theme.global.name.value = value === 'left' ? 'light' : 'dark'
}
</script>
