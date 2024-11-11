<template>
  <v-switch
    v-model="isPrivate"
    :label="isPrivate ? $t('dream-mall-panel.setup.private') : $t('dream-mall-panel.setup.public')"
    hide-details
    class="private-switch"
  />
</template>

<script setup lang="ts">
const isPrivate = defineModel<boolean>({ required: true })
</script>

<style scoped lang="scss">
.private-switch {
  :deep(.v-label) {
    width: 80px;
  }
}
</style>
