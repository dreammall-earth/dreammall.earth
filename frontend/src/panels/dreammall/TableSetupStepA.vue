<template>
  <SimpleButton label="Tisch erstellen" icon="mdi-video" size="small" @click="onClick" />
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const onClick = () => {
  emit('next')
}
</script>

<style scoped lang="scss"></style>
