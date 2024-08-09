<template>
  <SideMenu />
  <v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random">
    <template #image>
      <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
    </template>

    <template #prepend>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    </template>

    <v-app-bar-title>
      <h2>{{ $t('menu.project') }}</h2>
      {{ $t('menu.app') }}
    </v-app-bar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts" setup>
import SideMenu from '#components/menu/SideMenu.vue'
</script>
