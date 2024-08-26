<template>
  <DefaultLayout />
  <div class="view-selector mb-5">
    <v-btn @click="viewMode = '3D'">3D View</v-btn>
    <v-btn @click="viewMode = '2D'">2D View</v-btn>
  </div>
  <!-- <p class="mt-5">version 1</p>
   <p >frontend/src/components/ClusterGalaxy/ThreeScene.vue</p>
   <p class="mb-5">360° hozizontal, 45° vertikal, interaktive sterne</p>
   <ClusterGalaxyVisualizer />-->
   <!-- <p class="mt-5">version 2</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene2.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, interaktive sterne</p>
   <ClusterGalaxyVisualizer2 />
   <p class="mt-5">version 3</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene3.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer3 /> 
    <p class="mt-5">version 4</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene4.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer4 /> 
   <p class="mt-5">version 5</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene5.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer5 />
   <p class="mt-5">version 6</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene6.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer6 />-->
   <!-- <p class="mt-5">version 7</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene7.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer7 />  -->  
    <!-- <p class="mt-5">version 8</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene8.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer8 /> -->
    <!-- <p class="mt-5">version 9</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene9.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p>
   <ClusterGalaxyVisualizer9 /> -->

    <!-- <p class="mt-5">version 10</p>
   <p class="mb-5">frontend/src/components/ClusterGalaxy/ThreeScene10.vue</p>
    <p class="mb-5">360° hozizontal, 45° vertikal, zoombar, pulsierenden mittelstern, verbindungen, interaktive sterne</p> -->
   
   <component :is="currentViewComponent" />

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
// import ClusterGalaxyVisualizer from '#components/ClusterGalaxy/ThreeScene.vue';
// import ClusterGalaxyVisualizer2 from '#components/ClusterGalaxy/ThreeScene2.vue';
// import ClusterGalaxyVisualizer3 from '#components/ClusterGalaxy/ThreeScene3.vue';
// import ClusterGalaxyVisualizer4 from '#components/ClusterGalaxy/ThreeScene4.vue';
// import ClusterGalaxyVisualizer5 from '#components/ClusterGalaxy/ThreeScene5.vue';
// import ClusterGalaxyVisualizer6 from '#components/ClusterGalaxy/ThreeScene6.vue';
// import ClusterGalaxyVisualizer7 from '#components/ClusterGalaxy/ThreeScene7.vue';
// import ClusterGalaxyVisualizer8 from '#components/ClusterGalaxy/ThreeScene8.vue';
// import ClusterGalaxyVisualizer9 from '#components/ClusterGalaxy/ThreeScene9.vue';
import ClusterGalaxy3D from '#components/ClusterGalaxy/ClusterGalaxy2D.vue';
import ClusterGalaxy2D from '#components/ClusterGalaxy/ClusterGalaxy2D.vue';


const viewMode = ref('3D');
const currentViewComponent = computed(() => {
  return viewMode.value === '3D' ? ClusterGalaxy3D : ClusterGalaxy2D;
});
</script>
