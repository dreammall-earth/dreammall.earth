<template>
  <form class="d-flex flex-column align-center pa-4 w-100" @submit.prevent="onNext"></form>
</template>

<script setup lang="ts">
import Invitation from '#components/malltalk/interfaces/Invitation'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const invitation = defineModel<Invitation>({ required: true })

const onNext = () => emit('next')
</script>

<style lang="scss" scoped>

</style>
