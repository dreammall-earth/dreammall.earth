<template>
  <v-app-bar :absolute="true" color="#D8D8D8" flat class="topmenu pa-4">
    <v-row>
      <v-col class="">
        <LogoImage />
      </v-col>
      <v-col class="d-none d-md-flex align-center justify-center grow">
        <AnchorLink class="mx-4" href="#about" :label="$t('menu.about')"></AnchorLink>
        <AnchorLink class="mx-4" href="#products" :label="$t('menu.products')"></AnchorLink>
        <AnchorLink class="mx-4" href="#contact" :label="$t('menu.contact')"></AnchorLink>
      </v-col>
      <v-col class="d-none d-md-flex">
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'vuetify'

import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'

// const { current: locale } = useLocale()
// const isEnabled = ref(locale.value === 'de')
// const onChange = () => {
//   locale.value = isEnabled.value ? 'de' : 'en'
// }
</script>

<style scoped lang="scss">
.topmenu{
  background: linear-gradient(0deg, #F5F5F5 0.06%, #D8D8D8 100%);
}
</style>
