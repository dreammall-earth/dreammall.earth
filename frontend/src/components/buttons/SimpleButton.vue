<template>
  <v-btn elevation="0" :prepend-icon="icon" class="custom-green-btn" rounded @click="onClick">
    {{ label }}
  </v-btn>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
.custom-green-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: auto !important;
  min-height: 42px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  color: rgb(var(--v-theme-dm-panel-submit-color));
  text-transform: none;
  background-color: rgb(var(--v-theme-dm-panel-submit-background-color));

  &::before {
    display: none;
  }

  & :deep(.v-btn__content) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  & :deep(.v-btn__prepend) {
    margin-right: 8px !important;
    margin-bottom: 0 !important;
  }
}
</style>
