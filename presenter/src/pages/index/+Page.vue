<template>
  <DefaultLayout class="index-page">
    <div id="intro-section" class="mb-4">
      <IntroSection />
    </div>
    <div id="about" class="py-16 px-4 d-flex justify-center">
      <AboutSection />
    </div>
    <div id="products" class="py-16 px-4">
      <ProductsSection />
    </div>
    <div id="planning-section" class="py-16 px-4">
      <PlanningSection />
    </div>
    <div id="newsletter-section" class="py-16 px-4">
      <NewsletterSection ref="anchorNewsletter" />
    </div>
    <div id="coffee-section" class="py-16 px-4">
      <CoffeeSection />
    </div>
    <div id="cta-section" class="py-16 px-4">
      <CallToActionSection />
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import DefaultLayout from '#layouts/DefaultLayout.vue'
import AboutSection from '#root/src/components/sections/AboutSection.vue'
import CallToActionSection from '#root/src/components/sections/CallToActionSection.vue'
import CoffeeSection from '#root/src/components/sections/CoffeeSection.vue'
import IntroSection from '#root/src/components/sections/IntroSection.vue'
import NewsletterSection from '#root/src/components/sections/NewsletterSection.vue'
import PlanningSection from '#root/src/components/sections/PlanningSection.vue'
import ProductsSection from '#root/src/components/sections/ProductsSection.vue'

const anchorNewsletter = ref()
const focusInput = () => {
  if (anchorNewsletter.value) {
    anchorNewsletter.value.focusInput()
  }
}

defineExpose({
  anchorNewsletter,
  focusInput,
})
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.index-page {
  overflow: hidden;
  background: $background-color-primary;

  #intro-section {
    // fix for vuetify negative margin
    height: calc(100vh + 12px);
  }

  #about {
    background: $background-color-alt;
    box-shadow: $section-box-shadow;
  }

  #newsletter-section {
    background: $background-color-alt;
    box-shadow: $section-box-shadow;
  }

  .page-container {
    margin-top: 0;
  }
}
</style>

<style lang="scss">
.index-page {
  .page-container {
    margin-top: 0 !important;
  }
}
</style>
