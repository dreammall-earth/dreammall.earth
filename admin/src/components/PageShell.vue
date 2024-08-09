<template>
  <v-app>
    <NavbarTop />
    <slot />
  </v-app>
</template>

<script lang="ts" setup>
import NavbarTop from '#components/menu/NavBarTop.vue'
</script>
