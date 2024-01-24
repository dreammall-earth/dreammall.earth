<template>
  <DefaultLayout class="index-page">
    <div id="section1" class="mb-4">
      <Section1 />
    </div>
    <div id="about" class="py-16 px-4 d-flex justify-center">
      <Section2 />
    </div>
    <div id="products" class="py-16 px-4">
      <Section3 />
    </div>
    <div id="planning-section" class="py-16 px-4">
      <Section4 />
    </div>
    <div id="newsletter-section" class="py-16 px-4">
      <NewsletterSection />
    </div>
    <div id="coffee-section" class="py-16 px-4">
      <Section5 />
    </div>
    <div id="section6" class="py-16 px-4">
      <Section6 />
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
import Section5 from '#root/src/components/sections/FifthSection.vue'
import Section1 from '#root/src/components/sections/FirstSection.vue'
import Section4 from '#root/src/components/sections/FourthSection.vue'
import NewsletterSection from '#root/src/components/sections/NewsletterSection.vue'
import Section2 from '#root/src/components/sections/SecondSection.vue'
import Section6 from '#root/src/components/sections/SixthSection.vue'
import Section3 from '#root/src/components/sections/ThirdSection.vue'
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.index-page {
  overflow: hidden;
  background: $background-color-primary;

  #section1 {
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
}
</style>
