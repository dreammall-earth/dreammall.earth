<template>
  <v-main class="main-layout">
    <HeaderMenu />
    <v-container fluid class="page-container pa-0">
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
    <FooterMenu />
  </v-main>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

import FooterMenu from '#components/menu/FooterMenu.vue'
import HeaderMenu from '#components/menu/HeaderMenu.vue'

const slots = useSlots()
</script>

<style scoped lang="scss">
.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: #f5f5f5;

  .page-container {
    margin-top: 95px;
  }
}
</style>

<style lang="scss">
html {
  scroll-behavior: smooth;

  // fixed header offset
  scroll-padding-top: 95px;
}
</style>
