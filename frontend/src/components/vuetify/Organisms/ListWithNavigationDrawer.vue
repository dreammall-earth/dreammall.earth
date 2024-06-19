<template>
    <NavigationDrawer :model-value="drawer" :location="location" @update:model-value="updateDrawer">
      <SearchField
        v-model="search"
        label="Open Tables, Jobs"
        prepend-inner-icon="mdi-tune"
      ></SearchField>
      <v-list>
        <div class="mx-4">{{ $t('menu.roomList') }}</div>
        <ListElement :items="filteredItems" @item-click="updateDrawer(false)" />
      </v-list>
    </NavigationDrawer>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { VAvatar, VIcon, VImg } from 'vuetify/components'
  import SearchField from '../search/SearchField.vue'
  import ListElement from './../Atoms/ListElement.vue'
  import NavigationDrawer from './../Atoms/NavigationDrawer.vue'
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
  const search = ref('')
  const items = [
    {
      title: 'LOLLY Krypto Entwicklung',
      subtitle: 'Krypto für Alle',
      prepend: VAvatar,
      prependProps: { color: 'primary', icon: 'mdi-lock' },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
    },
    {
      title: 'Aachener Freunde Treff',
      subtitle: 'Aachener Freunde Treff',
      prepend: VImg,
      prependProps: {
        src: 'https://picsum.photos/40',
        referrerpolicy: 'no-referrer',
        width: 40,
        height: 40,
      },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
    },
    {
      title: 'Building A Wooden Guitar',
      subtitle: 'Building A Wooden Guitar',
      prepend: VImg,
      prependProps: {
        src: 'https://picsum.photos/39',
        referrerpolicy: 'no-referrer',
        width: 40,
        height: 40,
      },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
    },
    {
      title: 'Co Working Space Manufaktur',
      subtitle: 'Co Working Space Manufaktur',
      prepend: VImg,
      prependProps: {
        src: 'https://picsum.photos/41',
        referrerpolicy: 'no-referrer',
        width: 40,
        height: 40,
      },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
    },
    {
      title: 'Intervallfasten Kalender',
      subtitle: 'Intervallfasten Kalender',
      prepend: VImg,
      prependProps: {
        src: 'https://picsum.photos/42',
        referrerpolicy: 'no-referrer',
        width: 40,
        height: 40,
      },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical-circle', class: 'append-icon' },
    },
    {
      title: 'Lomografie 2050',
      subtitle: 'Lomografie 2050',
      prepend: VImg,
      prependProps: {
        src: 'https://picsum.photos/46',
        referrerpolicy: 'no-referrer',
        width: 40,
        height: 40,
      },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical-circle', class: 'append-icon' },
    },
    {
      title: 'Freies Treffen U50',
      subtitle: 'Freies Treffen U50',
      prepend: VAvatar,
      prependProps: { color: 'primary', image: 'https://picsum.photos/46' },
      append: VIcon,
      appendProps: { icon: 'mdi-dots-vertical', class: 'append-icon' },
    },
  ]
  const filteredItems = computed(() => {
    if (!search.value) {
      return items
    }
    return items.filter((item) => item.title.toLowerCase().includes(search.value.toLowerCase()))
  })
  const updateDrawer = (value: boolean) => {
    emits('update:drawer', value)
  }
  </script>