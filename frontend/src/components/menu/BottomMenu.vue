<template>
  <div>
    <v-bottom-navigation>
      <v-btn value="message">
        <MessageIndicator :number-of-messages="3" />
      </v-btn>
      <v-btn value="news">
        <NewsIndicator :has-news="true" />
      </v-btn>
      <v-btn value="rooms">
        <Circle @click="toggleDrawer">
          <v-icon icon="$camera"></v-icon>
        </Circle>
      </v-btn>
      <v-btn value="rooms">
        <UserInfo />
      </v-btn>
    </v-bottom-navigation>
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

v-bottom-navigation {
  z-index: 10;
}
.bottom-menu {
  bottom: 0;
  left: 0;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;

}
</style>
