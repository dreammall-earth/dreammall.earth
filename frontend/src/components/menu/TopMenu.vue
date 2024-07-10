<template>
  <div class="top-menu mt-6 mt-sm-0">
    <v-app-bar flat class="app-bar" height="70">
      <v-row class="ma-1">
        <v-col class="d-none d-md-flex align-center">
          <a href="/" class="logo">
            <LogoImage size="small" />
          </a>
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
              <UserInfo class="ml-2" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
  <TablesDrawer v-model="isTablesDrawerVisible" location="right" />
</template>

<script lang="ts" setup>
import LightDarkSwitch from '#components/menu/LightDarkSwitch.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'

import Circle from './CircleElement.vue'

const isTablesDrawerVisible = defineModel<boolean>()

const toggleDrawer = () => {
  isTablesDrawerVisible.value = !isTablesDrawerVisible.value
}
</script>

<style scoped lang="scss">
.app-bar {
  position: sticky;
  top: 0;
  background: transparent !important;
}

.logo {
  width: 140px;
}

.top-menu {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
