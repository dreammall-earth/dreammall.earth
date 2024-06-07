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
    <ListWithNavigationDrawer :drawer="drawer" @update:drawer="drawer = $event" :location="location" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Circle from './CircleElement.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import UserInfo from './UserInfo.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

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
</style>
