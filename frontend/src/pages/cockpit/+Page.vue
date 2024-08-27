<template>
  <DefaultLayout>
    <div class="cockpit">
      <AboutMe />
      <MyTables />
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import AboutMe from '#components/cockpit/about-me/AboutMe.vue'
import MyTables from '#components/cockpit/my-tables/MyTables.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.cockpit {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: center;
  justify-content: center;
  margin: auto;
}

@media #{map.get($display-breakpoints, 'md-and-up')} {
  .cockpit {
    grid-template-columns: 335px 335px;
    max-width: 1200px;
  }
}
</style>
