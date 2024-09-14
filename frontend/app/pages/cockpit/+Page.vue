<template>
  <DefaultLayout>
    <CockpitLayout>
      <AboutMe />
      <MyTables />
      <PaymentLink />
    </CockpitLayout>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import AboutMe from '#app/components/cockpit/about-me/AboutMe.vue'
import CockpitLayout from '#app/components/cockpit/cockpit-layout/CockpitLayout.vue'
import MyTables from '#app/components/cockpit/my-tables/MyTables.vue'
import PaymentLink from '#app/components/cockpit/payment-link/PaymentLink.vue'
import DefaultLayout from '#app/layouts/DefaultLayout.vue'
</script>
