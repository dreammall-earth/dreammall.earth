<template>
  <div class="navigation-drawer-box d-md-none d-lg-none position-fixed mb-5 pb-5">
    <v-navigation-drawer
      :model-value="drawer"
      :location="location"
      width="300px"
      class="menu-drawer-top"
      @update:model-value="updateDrawer"
    >
      <v-list>
        <div class="mx-4">{{ $t('menu.roomList') }}</div>
        <ListElement :items="items" />
      </v-list>
    </v-navigation-drawer>
  </div>
  <div
    class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface d-md-none d-lg-none"
  >
    <MessageIndicator :number-of-messages="3" />
    <NewsIndicator :has-news="true" />
    <CreateButtonMobile />
    <Circle @click="toggleDrawer">
      <v-icon icon="$camera"></v-icon>
    </Circle>
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
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import UserInfo from './UserInfo.vue'

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

// const emits = defineEmits(['update:drawer'])
</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  left: 0;
  z-index: 1;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;

  .camera-button {
    transform: translateX(20px);
  }
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
