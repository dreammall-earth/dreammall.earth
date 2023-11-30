<template>
<div>
  <v-footer
      color="#f5f5f5"
      dark
    >
      <v-row
        justify="center"
        class="my-4 text-left"
      >
        <v-col cols="12" md="2">
            <LogoImage  size="small"/>
        </v-col>        
        <v-col cols="7" md="3" class="d-flex flex-column align-start ">
          <h2 class="footer-header mb-4 text-left">{{ $t('menu.header.sitemap') }}</h2>
          <AnchorLink href="/" :label="$t('menu.home')"></AnchorLink>
          <AnchorLink href="/" :label="$t('menu.worldCoffeeHouse')"></AnchorLink>
          <AnchorLink class="min-width-remover" href="/" :label="$t('menu.mall')"></AnchorLink>
          <AnchorLink href="/" :label="$t('menu.humanAndProjects')"></AnchorLink>
        </v-col>
        
        <v-col cols="5" md="3">
          <h2 class="footer-header mb-4 text-left">{{ $t('menu.header.contact') }}</h2>
          <div class="footer-links">
          <AnchorLink href="/" :label="$t('menu.eMail')"></AnchorLink>
          <AnchorLink href="/" :label="$t('menu.linkedIn')"></AnchorLink>
          <AnchorLink href="/" :label="$t('menu.instagramm')"></AnchorLink>
          <AnchorLink class="min-width-remover" href="/" :label="$t('menu.twitter')"></AnchorLink>
          </div>
        </v-col>
        
        <v-col cols="12" md="4">
          <h2 class="footer-header mb-14 text-left">{{ $t('menu.header.newsletter') }}</h2>
          <div class="text-button-container">
            <TextButtonInput :inputLabel="foo" :buttonLabel="bar"></TextButtonInput>
          </div>
        </v-col>        
      </v-row>      
    </v-footer>
    <div class="gradient-bg"></div>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import AnchorLink from '#components/nav/AnchorLink.vue'
import TextButtonInput from '#components/inputs/TextButtonInput.vue'

import LogoImage from './LogoImage.vue'


const foo = "E-mailAdress"
const bar = "Submit"

</script>

<style scoped lang="scss">
.gradient-bg{
    background: linear-gradient(98.77deg, #3095D4 0%, rgba(249, 196, 81, 0.55) 99.16%);
    width: 100%;
    height: 10px;
}
.footer-header{
    color: #3D4753;
    font-weight: 600;
    font-family: "Poppins";
    font-size: 1.623rem;
    line-height: 2rem;
}
.footer-links{
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;
}
.text-button-container{
  max-width: 365px;
}
.min-width-remover{
  min-width: 0px;
}
</style>