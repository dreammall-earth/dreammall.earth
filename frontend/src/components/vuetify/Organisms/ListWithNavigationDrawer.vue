<template>
  <v-navigation-drawer
    :model-value="drawer"
    :location="location"
    width="auto"
    class="menu-drawer-top"
    @update:model-value="updateDrawer"
  >
    <!--
    <SearchField
      v-model="search"
      label="Open Tables, Jobs"
      prepend-inner-icon="mdi-tune"
    ></SearchField>
    -->
    <v-list>
      <div class="mx-4">{{ $t('menu.roomList') }}</div>
      <ListElement :items="items" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
// import { VAvatar, VIcon, VImg } from 'vuetify/components'

import ListElement from '#components/vuetify/Atoms/ListElement.vue'
// import SearchField from '#components/vuetify/Molecules/SearchField.vue'
import { useRoomsStore } from '#stores/roomsStore'

const roomsStore = useRoomsStore()

const { rooms: items } = storeToRefs(roomsStore)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
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

/*
    const search = ref('')

    const filteredItems = computed(() => {
    if (!search.value) {
    return items
    }
    return items.filter((item) => item.title.toLowerCase().includes(search.value.toLowerCase()))
    })
  */

const updateDrawer = (value: boolean) => {
  emits('update:drawer', value)
}
</script>
<style scoped>
.menu-drawer-top {
  margin-top: 74px;
}
</style>
