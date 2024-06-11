<template>
  <NavigationDrawer :model-value="drawer" :location="location" @update:model-value="updateDrawer">
    <ListElement :items="items" @item-click="updateDrawer(false)" />
  </NavigationDrawer>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import { VIcon } from 'vuetify/components'

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

const items = ref([
  {
    title: 'LOLLY Krypto Entwicklung',
    fullWidth: false,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
  {
    title: 'Aachener Freunde Treff',
    fullWidth: false,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
  {
    title: 'Building A Wooden Guitar',
    fullWidth: false,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
  {
    title: 'Co Working Space Manufaktur',
    fullWidth: true,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
  {
    title: 'Intervallfasten Kalender',
    fullWidth: false,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
  { title: 'Lomografie 2050', fullWidth: true, append: VIcon, appendProps: { icon: 'mdi-menu' } },
  {
    title: 'Freies Treffen U50',
    fullWidth: false,
    append: VIcon,
    appendProps: { icon: 'mdi-menu' },
  },
])

const updateDrawer = (value: boolean) => {
  emits('update:drawer', value)
}
</script>

<style scoped>
.list-container {
  margin-top: 20px;
}
</style>
