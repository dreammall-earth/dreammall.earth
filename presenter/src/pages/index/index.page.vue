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
    <div id="contact">
      <Section4 />
    </div>
    <div id="section6">
      <Section6 />
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
import Section1 from '#root/src/components/sections/FirstSection.vue'
import Section4 from '#root/src/components/sections/FourthSection.vue'
import Section2 from '#root/src/components/sections/SecondSection.vue'
import Section6 from '#root/src/components/sections/SixthSection.vue'
import Section3 from '#root/src/components/sections/ThirdSection.vue'
</script>
