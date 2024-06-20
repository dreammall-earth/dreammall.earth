<template>
  <div class="top-menu mt-6 mt-sm-0">
    <v-app-bar flat class="app-bar" height="70px">
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
              <Circle>
                <v-icon icon="$camera"></v-icon>
              </Circle>
              <UserInfo class="ml-2" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
</template>

<script lang="ts" setup>
import Circle from './CircleElement.vue'
import LightDarkSwitch from './LightDarkSwitch.vue'
import LogoImage from './LogoImage.vue'
import TabControl from './TabControl.vue'
import UserInfo from './UserInfo.vue'
</script>

<style scoped lang="scss">
.app-bar {
  position: static !important;
  background: transparent !important;
}

.logo {
  width: 140px;
}

.top-menu {
  position: sticky;
  top: 0;
}
</style>
