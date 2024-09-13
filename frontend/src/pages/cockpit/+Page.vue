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
import AboutMe from '#src/components/cockpit/about-me/AboutMe.vue'
import CockpitLayout from '#src/components/cockpit/cockpit-layout/CockpitLayout.vue'
import MyTables from '#src/components/cockpit/my-tables/MyTables.vue'
import PaymentLink from '#src/components/cockpit/payment-link/PaymentLink.vue'
import DefaultLayout from '#src/layouts/DefaultLayout.vue'
</script>
