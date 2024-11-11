<template>
  <StepHeader
    v-if="steps"
    :title="steps[currentStep]?.title.value ?? 'unknown'"
    :is-back-button-visible="currentStep > 0 && steps[currentStep]?.canBack !== false"
    :is-close-button-visible="true"
    :is-dream-mall-button-mode="props.isDreamMallButtonMode"
    @back="back"
    @close="$emit('close')"
  />
  <component
    :is="steps[currentStep]?.component"
    v-if="steps && currentStep < steps.length"
    v-model="model"
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    :class="$attrs.class"
    @next="next"
    @go-to="goTo"
    @submit="$emit('submit')"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts" generic="ModelType extends object">
import StepHeader from './StepHeader.vue'
import { Step, useSteps } from './useSteps'

const props = withDefaults(defineProps<{ steps: Step[]; isDreamMallButtonMode?: boolean }>(), {
  isDreamMallButtonMode: false,
})
const model = defineModel<ModelType>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()

const { currentStep, getCurrentId, next, back, goTo, reset } = useSteps(props.steps, emit)

defineExpose({ currentStep, getCurrentId, next, back, goTo, reset })
</script>
