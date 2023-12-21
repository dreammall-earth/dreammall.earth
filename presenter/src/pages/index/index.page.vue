<template>
  <DefaultLayout class="index-page">
    <div id="section1" class="h-screen mb-4">
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
.index-page {
  overflow: hidden;
  background: #f5f5f5;

  #about {
    background: #fff;
    box-shadow: 0 5px 5px 0 rgb(0 0 0 / 25%);
  }

  #newsletter-section {
    background: #fff;
    box-shadow: 0 5px 5px 0 rgb(0 0 0 / 25%);
  }
}
</style>
