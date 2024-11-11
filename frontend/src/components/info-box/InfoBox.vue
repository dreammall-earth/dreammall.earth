<template>
  <div class="info-box text-center pa-5 font-weight-medium">
    <LogoImage class="mx-auto" size="tiny" :text-enabled="false" />
    <p class="mt-5">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import LogoImage from '#layouts/menu/LogoImage.vue'

defineProps<{
  text: string
}>()
</script>

<style scoped lang="scss">
.info-box {
  color: rgb(var(--v-theme-info-box-text-color));
  background-color: var(--v-info-box-background-color);
  border-radius: 24px;
}
</style>
