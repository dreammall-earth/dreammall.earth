<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <div class="reminder pa-5 rounded-lg text-white font-weight-medium">
      <p class="text-center">
        Deine Vision wird Realität,<br />
        lass uns gerne dazu den ersten Schritt machen.
      </p>
    </div>

    <SimpleButton class="mt-12 mx-auto" label="Los geht's" @click="onNext" />
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#components/buttons/SimpleButton.vue'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const onNext = () => {
  emit('next')
}
</script>

<style scoped lang="scss">
.reminder {
  background-color: #8b949b; // todo: save globally
}
</style>
