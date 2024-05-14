<template>
  <v-main class="bg-background main-layout">
    <a href="/" class="logo d-none d-md-flex">
      <LogoImage size="small" />
    </a>
    <TopMenu />
    <v-container fluid class="page-container px-8">
      <v-row>
        <v-col v-if="slots.sidemenu" cols="2">
          <v-sheet rounded>
            <slot name="sidemenu"></slot>
          </v-sheet>
        </v-col>

        <v-col class="pa-0 pa-sm-1 pt-0">
          <v-sheet rounded class="pa-3" style="top: 90px">
            <slot />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <BottomMenu class="d-flex d-md-none" />
  </v-main>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

import BottomMenu from '#components/menu/BottomMenu.vue'
import TopMenu from '#components/menu/TopMenu.vue'
import LogoImage from '#components/menu/LogoImage.vue'

const slots = useSlots()
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: $background-color-primary;

  .page-container {
    margin-top: 110px;
  }
}

.logo {
  position: absolute;
  top: 20px;
  left: 90px;
  width: 140px;
}
</style>
