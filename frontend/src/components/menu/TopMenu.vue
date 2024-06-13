<template>
  <div class="top-menu">
    <v-app-bar flat class="app-bar">
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
              <UserInfo class="ml-2 user-info" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
    <!-- <NavigationDrawer
      v-model="drawer"
      :location="location"
      color="grey-lighten-4"
      temporary
      width="400"
      class="custom-drawer"
    >
      <ListElement :items="items" @item-click="toggleDrawer" />
    </NavigationDrawer> -->
    <ListWithNavigationDrawer
      :drawer="drawer"
      :location="location"
      @update:drawer="updateDrawer($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import Circle from './CircleElement.vue'
import LightDarkSwitch from './LightDarkSwitch.vue'
import ListWithNavigationDrawer from './ListWithNavigationDrawer.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import TabControl from './TabControl.vue'
import UserInfo from './UserInfo.vue'

const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const updateDrawer = (event: boolean) => {
  drawer.value = event
}

const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('right')
</script>

<style scoped lang="scss">
v-app-bar {
  z-index: 10;
  position: relative;
}

.app-bar {
  background: transparent !important;
}

.top-menu {
  position: relative;
  top: 0;
}

.custom-drawer {
  top: 70px; // Höhe der App-Bar
  z-index: 9;
}
</style>
