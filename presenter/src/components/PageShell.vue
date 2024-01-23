<template>
  <v-app>
    <HeaderMenu />
    <slot />
  </v-app>
</template>

<script lang="ts" setup>
import HeaderMenu from '#components/menu/HeaderMenu.vue'
</script>
