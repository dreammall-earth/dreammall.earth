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
import { ref } from 'vue'

import CreateButtonMobile from '#components/buttons/CreateButtonMobile.vue'

import Circle from './CircleElement.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import UserInfo from './UserInfo.vue'

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const updateDrawer = (event: boolean) => {
  drawer.value = event
}

const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('bottom')
</script>

<style scoped lang="scss">
// v-bottom-navigation {
//   z-index: 10;
// }
.create-button-mobile {
  transform: translate(20px, 30px);
    z-index: 1;
}
.navigation-drawer-box {
  bottom: 65px;
}

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
.v-navigation-drawer {
  scrollbar-width: thin;
}
</style>
<style>
 
.v-navigation-drawer__content {
  scrollbar-width: thin;
}
</style>