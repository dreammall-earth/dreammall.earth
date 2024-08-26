<template>
  <DefaultLayout />
  <div class="view-selector mb-5">
    <v-btn @click="viewMode = '3D'">3D View</v-btn>
    <v-btn @click="viewMode = '2D'">2D View</v-btn>
  </div>

  <component :is="currentViewComponent" :star-data="starData" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import ClusterGalaxy2D from '#components/ClusterGalaxy/ClusterGalaxy2D.vue'
import ClusterGalaxy3D from '#components/ClusterGalaxy/ClusterGalaxy3D.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import starData from '#src/assets/user_data.json'

const viewMode = ref('3D')
const currentViewComponent = computed(() => {
  return viewMode.value === '3D' ? ClusterGalaxy3D : ClusterGalaxy2D
})
</script>
