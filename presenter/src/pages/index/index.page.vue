<template>
  <DefaultLayout>
    <div id="section1">
      <Section1 />
    </div>
    <div id="about">
      <Section2 />
    </div>
    <div id="products">
      <Section3 />
    </div>
    <div id="section4">
      <Section4 />
    </div>
    <div id="newsletter-section" class="py-8">
      <NewsletterSection />
    </div>
    <div id="section5">
      <Section5 />
    </div>
    <div id="section6">
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
#newsletter-section {
  background: #fff;
  box-shadow: 0 5px 5px 0 rgb(0 0 0 / 25%);
}
</style>
