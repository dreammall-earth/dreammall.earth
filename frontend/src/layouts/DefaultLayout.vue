<template>
  <v-main class="bg-background main-layout">
    <TopMenu />
    <v-container fluid class="page-container px-8">
      <v-row>
        <v-col v-if="slots.sidemenu" cols="2">
          <v-sheet rounded>
            <slot name="sidemenu"></slot>
          </v-sheet>
        </v-col>

        <v-col class="pa-0 pa-sm-1 pt-0">
          <slot />
        </v-col>
      </v-row>
    </v-container>
    <BottomMenu class="d-md-none" />
    <div id="teleported"></div>
  </v-main>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

import BottomMenu from '#components/menu/BottomMenu.vue'
import TopMenu from '#components/menu/TopMenu.vue'

const slots = useSlots()
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';
@import 'vuetify/lib/styles/settings/_variables';

.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: $background-color-primary;

  .page-container {
    margin-top: 110px;
  }

  #teleported {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    .page-container {
      margin-top: 20px;
      margin-bottom: 50px;
    }
  }
}
</style>
