<template>
  <v-app-bar :absolute="true" color="#D8D8D8" flat class="topmenu pa-4">
    <v-row>
      <v-col>
        <LogoImage />
      </v-col>
      <v-col class="d-none d-md-flex align-center justify-center grow">
        <AnchorLink class="mx-4" href="#about" :label="$t('menu.header.about')"></AnchorLink>
        <AnchorLink class="mx-4" href="#products" :label="$t('menu.header.products')"></AnchorLink>
        <AnchorLink class="mx-4" href="#contact" :label="$t('menu.header.contact')"></AnchorLink>
      </v-col>
      <v-col class="d-none d-md-flex"> </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'
</script>

<style scoped lang="scss">
.topmenu {
  background: linear-gradient(0deg, #f5f5f5 0.06%, #d8d8d8 100%);
}
</style>
