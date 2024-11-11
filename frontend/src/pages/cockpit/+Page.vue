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
import DefaultLayout from '#layouts/DefaultLayout.vue'

import AboutMe from './(components)/about-me/AboutMe.vue'
import CockpitLayout from './(components)/cockpit-layout/CockpitLayout.vue'
import MyTables from './(components)/my-tables/MyTables.vue'
import PaymentLink from './(components)/payment-link/PaymentLink.vue'
</script>
