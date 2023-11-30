<template>
  <v-main class="bg-grey-lighten-3">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col v-if="slots.sidemenu" cols="2">
          <v-sheet rounded>
            <slot name="sidemenu"></slot>
          </v-sheet>
        </v-col>

        <v-col>          
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

const slots = useSlots()
</script>
