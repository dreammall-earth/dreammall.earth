<template>
  <div  class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface">
 
        <MessageIndicator :number-of-messages="3" />
        <NewsIndicator :has-news="true" />
     
        <Circle @click="toggleDrawer">
          <v-icon icon="$camera"></v-icon>
        </Circle>
      
      <UserInfo />
  
   
    <ListWithNavigationDrawer
      :drawer="drawer"
      :location="location"
      @update:drawer="drawer = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import Circle from './CircleElement.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import UserInfo from './UserInfo.vue'

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('bottom')
</script>

<style scoped lang="scss">
/*v-bottom-navigation {
  z-index: 10;
}*/
.bottom-menu {
  bottom: 0;
  left: 0;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
}
</style>
