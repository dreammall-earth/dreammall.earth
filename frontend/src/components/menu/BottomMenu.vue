<template>
  <div class="navigation-drawer-box d-md-none d-lg-none position-fixed mb-5 pb-5">
    <ListWithNavigationDrawer :drawer="drawer" :location="location" @update:drawer="updateDrawer" />
  </div>
  <div
    class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface d-md-none d-lg-none"
  >
    <MessageIndicator :number-of-messages="3" />
    <NewsIndicator :has-news="true" />
    <CreateButtonMobile />
    <Circle @click="toggleDrawer" class="camera-button">
      <v-icon icon="$camera"></v-icon>
    </Circle>
    <CreateButtonMobile />
    <UserInfo />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import CreateButtonMobile from '#components/buttons/CreateButtonMobile.vue'
import ListElement from '#components/vuetify/Atoms/ListElement.vue'
import { useRoomsStore } from '#stores/roomsStore'

import Circle from './CircleElement.vue'
import UserInfo from './UserInfo.vue'

import MessageIndicator from '#components/menu/MessageIndicator.vue'
import NewsIndicator from '#components/menu/NewsIndicator.vue'
import ListWithNavigationDrawer from '#components/vuetify/Organisms/ListWithNavigationDrawer.vue'


const roomsStore = useRoomsStore()
const { rooms: items } = storeToRefs(roomsStore)

const drawer = ref(false)
const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('bottom')

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const updateDrawer = (value: boolean) => {
  drawer.value = value
}

</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  left: 0;
  z-index: 1;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
}

 .camera-button {
    cursor: pointer;
  }

.create-button-mobile {
  z-index: 1;
  transform: translate(20px, 30px);
}

.navigation-drawer-box {
  bottom: 65px;
}

.v-navigation-drawer {
  scrollbar-width: thin;
}

.v-navigation-drawer__content {
  scrollbar-width: thin;
}
</style>
