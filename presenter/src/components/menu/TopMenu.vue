<template>
  <v-app-bar :color="appBackground" flat class="topmenu">
    <v-row>
      <v-col>
        <LogoImage class="ml-8" />
      </v-col>
      <v-col class="d-none d-md-flex align-center justify-center grow">
        <AnchorLink class="mx-4" href="/#about" :label="$t('menu.header.about')"></AnchorLink>
        <AnchorLink class="mx-4" href="/#products" :label="$t('menu.header.products')"></AnchorLink>
        <AnchorLink class="mx-4" href="/#contact" :label="$t('menu.header.contact')"></AnchorLink>
      </v-col>
      <v-col class="d-none d-md-flex"> </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'

const appBackground = ref('transparent')

function changeAppBarBackground() {
  if (appBackground.value !== '#f5f5f5') {
    // TODO change class for smoother transition
    appBackground.value = '#f5f5f5'
  }
}

onMounted(() => {
  window.addEventListener('scroll', changeAppBarBackground)
})
onUnmounted(() => {
  window.removeEventListener('scroll', changeAppBarBackground)
})
</script>

<style scoped lang="scss">
.topmenu {
  background: linear-gradient(0deg, #f5f5f5 0.06%, #d8d8d8 100%);
}
</style>

<style lang="scss">
.topmenu {
  .v-toolbar__content {
    height: 95px !important;
  }
}
</style>
