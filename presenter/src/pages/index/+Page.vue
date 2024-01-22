<template>
  <DefaultLayout class="index-page">
    <div id="intro-section" class="mb-4">
      <IntroSection />
    </div>
    <div id="about" class="py-16 px-4 d-flex justify-center">
      <AboutSection />
    </div>
    <div id="products" class="py-16 px-4">
      <TeaserSection />
    </div>
    <div id="planning-section" class="py-16 px-4">
      <PlanningSection />
    </div>
    <div id="newsletter-section" class="py-16 px-4">
      <NewsletterSection />
    </div>
    <div id="coffee-section" class="py-16 px-4">
      <ProjectSection />
    </div>
    <div id="section6" class="py-16 px-4">
      <CallToActionSection />
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
import AboutSection from '#root/src/components/sections/AboutSection.vue'
import CallToActionSection from '#root/src/components/sections/CallToActionSection.vue'
import IntroSection from '#root/src/components/sections/IntroSection.vue'
import NewsletterSection from '#root/src/components/sections/NewsletterSection.vue'
import ProjectSection from '#root/src/components/sections/ProjectSection.vue'
import TeaserSection from '#root/src/components/sections/TeaserSection.vue'
import PlanningSection from '#root/src/components/sections/PlanningSection.vue'
</script>

<style scoped lang="scss">
.index-page {
  overflow: hidden;
  background: #f5f5f5;

  #intro-section {
    // fix for vuetify negative margin
    height: calc(100vh + 12px);
  }

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
