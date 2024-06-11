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
              <UserInfo class="ml-2" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :location="location"
      color="grey-lighten-4"
      temporary
      width="400"
      class="custom-drawer"
    >
      <ListElement :items="items" @item-click="toggleDrawer" />
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import Circle from './CircleElement.vue'
import LightDarkSwitch from './LightDarkSwitch.vue'
import ListElement from './ListElement.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import TabControl from './TabControl.vue'
import UserInfo from './UserInfo.vue'

const drawer = ref(false)
const location = ref<'bottom' | 'right' | 'left' | 'end' | 'top' | 'start'>('right')

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const items = ref([
  { title: 'LOLLY Krypto Entwicklung', fullWidth: false },
  { title: 'Aachener Freunde Treff', fullWidth: false },
  { title: 'Building A Wooden Guitar', fullWidth: false },
  { title: 'Co Working Space Manufaktur', fullWidth: true },
  { title: 'Intervallfasten Kalender', fullWidth: false },
  { title: 'Lomografie 2050', fullWidth: true },
  { title: 'Freies Treffen U50', fullWidth: false },
])
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
