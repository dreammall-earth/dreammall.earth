<template>
  <Switch
    class="light-dark-switch"
    :default-state="theme.global.current.value.dark ? 'right' : 'left'"
    :label="`${$t('menu.theme.light')} / ${$t('menu.theme.dark')}`"
    @change="setTheme"
  />
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

import Switch, { State } from '#components/switch/SwitchComponent.vue'

const theme = useTheme()

function setTheme(value: State) {
  theme.global.name.value = value === 'left' ? 'light' : 'dark'
}
</script>
