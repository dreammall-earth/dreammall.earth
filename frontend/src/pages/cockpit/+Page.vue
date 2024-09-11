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
import AboutMe from '#components/cockpit/about-me/AboutMe.vue'
import CockpitLayout from '#components/cockpit/cockpit-layout/CockpitLayout.vue'
import MyTables from '#components/cockpit/my-tables/MyTables.vue'
import PaymentLink from '#components/cockpit/payment-link/PaymentLink.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
</script>
