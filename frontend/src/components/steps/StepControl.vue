<template>
  <StepHeader
    v-if="steps"
    :title="steps[currentStep]?.title ?? 'unknown'"
    :is-back-button-visible="currentStep > 0"
    :is-close-button-visible="true"
    @back="onBack"
    @close="$emit('close')"
  />
  <component
    :is="steps[currentStep].component"
    v-if="steps && currentStep < steps.length"
    v-model="model"
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    @next="onNext"
    @go-to="goTo"
    @submit="$emit('submit')"
  />
</template>

<script setup lang="ts" generic="ModelType extends object">
import StepHeader from './StepHeader.vue'
import { Step, useSteps } from './useSteps'

const props = defineProps<{ steps: Step[] }>()
const model = defineModel<ModelType>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const { currentStep, onNext, onBack, goTo, reset } = useSteps(props.steps, emit)

defineExpose({ reset })
</script>
