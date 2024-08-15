<template>
  <div></div>
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { onBeforeMount } from 'vue'

onBeforeMount(() => {
  navigate('/')
})
</script>
