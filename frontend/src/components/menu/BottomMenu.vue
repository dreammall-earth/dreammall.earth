<template>
  <div class="navigation-drawer-box d-md-none d-lg-none position-fixed mb-5 pb-5">
    <ListWithNavigationDrawer
      :drawer="drawer"
      :location="location"
      @update:drawer="updateDrawer($event)"
    />
  </div>
  <div
    class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface d-md-none d-lg-none"
  >
    <Circle class="camera-button" @click="toggleDrawer">
      <v-icon icon="$camera"></v-icon>
    </Circle>
    <CreateButtonMobile />
    <UserInfo />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import CreateButtonMobile from '#components/buttons/CreateButtonMobile.vue'
import ListWithNavigationDrawer from '#components/vuetify/Organisms/ListWithNavigationDrawer.vue'

import Circle from './CircleElement.vue'
import UserInfo from './UserInfo.vue'

const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
const updateDrawer = (value: boolean) => {
  drawer.value = value
}
const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('bottom')
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
