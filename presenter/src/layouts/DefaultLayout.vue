<template>
  <v-main class="main-layout">
    <HeaderMenu :auth="publicEnv.AUTH" />
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
import { usePageContext } from '#context/usePageContext'

const { publicEnv } = usePageContext()
const slots = useSlots()
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: $background-color-primary;

  .page-container {
    margin-top: 95px;
  }
}
</style>

<style lang="scss">
@import '#root/src/assets/scss/style';

html {
  scroll-behavior: smooth;

  // fixed header offset
  scroll-padding-top: $fixed-header-height;
}
</style>
