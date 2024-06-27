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
  </div>
  <ListWithNavigationDrawer
    :drawer="drawer"
    :location="location"
    @update:drawer="updateDrawer($event)"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import LightDarkSwitch from '#components/menu/LightDarkSwitch.vue'
import MessageIndicator from '#components/menu/MessageIndicator.vue'
import NewsIndicator from '#components/menu/NewsIndicator.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'

import Circle from './CircleElement.vue'

import ListWithNavigationDrawer from '#components/vuetify/Organisms/ListWithNavigationDrawer.vue'

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
.app-bar {
  position: static !important;
  background: transparent !important;
}

.top-menu {
  position: sticky;
  top: 0;
}
</style>
