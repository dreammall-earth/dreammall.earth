<template>
  <div class="top-menu mt-6 mt-sm-0">
    <v-app-bar flat class="app-bar" height="70px">
      <v-row class="ma-1">
        <v-col class="d-none d-md-flex align-center">
          <MessageIndicator :number-of-messages="3" />
        </v-col>
        <v-col class="d-flex align-center justify-center">
          <TabControl />
        </v-col>
        <v-col class="d-none d-md-flex align-center">
          <v-row>
            <v-col class="d-flex align-center">
              <LightDarkSwitch class="d-none d-lg-flex" />
            </v-col>
            <v-col class="d-flex align-center justify-end">
              <Circle @click="toggleDrawer">
                <v-icon icon="$camera"></v-icon>
              </Circle>
              <NewsIndicator :has-news="true" class="ml-2" />
              <UserInfo class="ml-2" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      
    </v-app-bar>
    <ListWithNavigationDrawer :drawer="drawer" @update:drawer="drawer = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Circle from './CircleElement.vue'
import LightDarkSwitch from './LightDarkSwitch.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import TabControl from './TabControl.vue'
import UserInfo from './UserInfo.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>

<style scoped lang="scss">
.app-bar {
  position: static !important;
  background: transparent !important;
}

.top-menu {
  position: sticky;
  top: 0;
}
</style>
