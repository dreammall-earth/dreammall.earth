<template>
  <DefaultLayout />
  <p class="mt-5">version 1</p>
   <p >frontend/src/components/ClusterGalaxy/ThreeScene.vue</p>
   <p class="mb-5">360° hozizontal, 45° vertikal, interaktive sterne</p>
   <ClusterGalaxyVisualizer />
   <p class="mt-5">version 2</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene2.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, interaktive sterne</p>
   <ClusterGalaxyVisualizer2 />
   <p class="mt-5">version 3</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene3.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer3 />
</template>

<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
import ClusterGalaxyVisualizer from '#components/ClusterGalaxy/ThreeScene.vue';
import ClusterGalaxyVisualizer2 from '#components/ClusterGalaxy/ThreeScene2.vue';
import ClusterGalaxyVisualizer3 from '#components/ClusterGalaxy/ThreeScene3.vue';

</script>
