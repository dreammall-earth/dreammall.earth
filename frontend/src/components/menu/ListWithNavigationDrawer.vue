<template>
  <NavigationDrawer :model-value="drawer" :location="location" @update:model-value="updateDrawer">
    <ListElement :items="items" @item-click="updateDrawer(false)" />
  </NavigationDrawer>
</template>

<script lang="ts" setup>
import { VAvatar, VIcon, VImg } from 'vuetify/components'

import ListElement from './ListElement.vue'
import NavigationDrawer from './NavigationDrawer.vue'

defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String as () => 'right' | 'bottom' | 'left' | 'end' | 'top' | 'start' | undefined,
    required: false,
    default: 'right',
  },
})

const emits = defineEmits(['update:drawer'])

const items = [
  {
    title: 'LOLLY Krypto Entwicklung',
    subtitle: 'Krypto für Alle',
    fullWidth: false,
    prepend: VAvatar,
    prependProps: { color: 'primary', icon: 'mdi-lock' },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical' },
  },
  {
    title: 'Aachener Freunde Treff',
    subtitle: 'Aachener Freunde Treff',
    fullWidth: false,
    prepend: VImg,
    prependProps: { src: 'https://picsum.photos/40', referrerpolicy: 'no-referrer', width: 40, height: 40 },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical' },
  },
  {
    title: 'Building A Wooden Guitar',
    subtitle: 'Building A Wooden Guitar',
    fullWidth: false,
    prepend: VImg,
    prependProps: { src: 'https://picsum.photos/39', referrerpolicy: 'no-referrer', width: 40, height: 40 },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical' },
  },
  {
    title: 'Co Working Space Manufaktur',
    subtitle: 'Co Working Space Manufaktur',
    fullWidth: true,
    prepend: VImg,
    prependProps: { src: 'https://picsum.photos/41', referrerpolicy: 'no-referrer', width: 40, height: 40 },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical' },
  },
  {
    title: 'Intervallfasten Kalender',
    subtitle: 'Intervallfasten Kalender',
    fullWidth: false,
    prepend: VImg,
    prependProps: { src: 'https://picsum.photos/42', referrerpolicy: 'no-referrer', width: 40, height: 40 },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical-circle' },
  },
  { 
    title: 'Lomografie 2050',
    subtitle: 'Lomografie 2050',    
    fullWidth: true, 
    prepend: VImg,
    prependProps: { src: 'https://picsum.photos/46', referrerpolicy: 'no-referrer', width: 40, height: 40 },
    append: VIcon, appendProps: { icon: 'mdi-dots-vertical-circle' } 
  },
  {
    title: 'Freies Treffen U50',
    subtitle: 'Freies Treffen U50',
    fullWidth: false,
    prepend: VAvatar,
    prependProps: { color: 'primary', image: 'https://picsum.photos/46', },
    append: VIcon,
    appendProps: { icon: 'mdi-dots-vertical' },
  },
]

const updateDrawer = (value: boolean) => {
  emits('update:drawer', value)
}
</script>

<style scoped>
.list-container {
  margin-top: 20px;
}
</style>
