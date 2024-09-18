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
      <NewsletterSection />
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
import AboutSection from '#presenter/components/sections/AboutSection.vue'
import CallToActionSection from '#presenter/components/sections/CallToActionSection.vue'
import CoffeeSection from '#presenter/components/sections/CoffeeSection.vue'
import IntroSection from '#presenter/components/sections/IntroSection.vue'
import NewsletterSection from '#presenter/components/sections/NewsletterSection.vue'
import PlanningSection from '#presenter/components/sections/PlanningSection.vue'
import ProductsSection from '#presenter/components/sections/ProductsSection.vue'
import DefaultLayout from '#presenter/layouts/DefaultLayout.vue'
</script>

<style scoped lang="scss">
@import '#assets/scss/style';

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
