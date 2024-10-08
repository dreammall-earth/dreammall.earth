<template>
  <div class="reminder text-center pa-5 font-weight-medium">
    <LogoImage class="mx-auto" size="tiny" :text-enabled="false" />
    <p class="mt-5">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">

import LogoImage from "#components/menu/LogoImage.vue";

defineProps<{
  text: string
}>()

</script>

<style scoped lang="scss">
.reminder {
  color: rgb(var(--v-theme-info-box-text-color));
  background-color: var(--v-info-box-background-color);
  border-radius: 24px;
}
</style>