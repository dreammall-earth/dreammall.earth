<!--&lt;!&ndash;Prepared for refactoring panel flow. Not Ready to use &ndash;&gt;-->
<!--<template>-->
<!--  <PanelHeader-->
<!--    v-if="steps"-->
<!--    :title="steps[currentStep]?.title ?? 'unknown'"-->
<!--    :is-back-button-visible="currentStep > 0"-->
<!--    :is-close-button-visible="true"-->
<!--    @back="onBack"-->
<!--    @close="onClose"-->
<!--  />-->
<!--  <component-->
<!--    :is="steps[currentStep].component"--
<!--    v-if="steps && currentStep < steps.length"-->
<!--    v-bind="componentProps"-->
<!--    v-on="componentEmits"-->
<!--  />-->
<!--</template>-->

<!--<script setup lang="ts" generic="T extends PanelFlowProps">-->
<!--import { ref, onMounted, onUnmounted } from 'vue'-->

<!--import PanelHeader from '#src/panels/PanelHeader.vue'-->

<!--type StepId = string | (() => string)-->
<!--export type Step = {-->
<!--  component: unknown-->
<!--  id: string-->
<!--  title: string-->
<!--  submit: StepId-->
<!--  back: StepId-->
<!--}-->

<!--export type PanelFlowProps = {-->
<!--  steps: Step[]-->
<!--}-->

<!--export type PanelFlowEmits<T> = {-->
<!--  (e: 'close'): void-->
<!--  (e: 'complete'): void-->
<!--  (e: 'update:componentProps', value: T): void-->
<!--}-->

<!--const props = defineProps<T>()-->
<!--const emit = defineEmits<PanelFlowEmits<T>>()-->
<!--const componentProps = ref<T>()-->

<!--const currentStep = ref(0)-->

<!--const transitToNext = () => transitToId(props.steps[currentStep.value].submit)-->
<!--const transitToPrevious = () => transitToId(props.steps[currentStep.value].back)-->

<!--const transitToId = (destinationId: StepId) => {-->
<!--  if (destinationId === 'next') {-->
<!--    if (currentStep.value < props.steps.length - 1) {-->
<!--      currentStep.value++-->
<!--    } else {-->
<!--      emit('complete')-->
<!--    }-->
<!--  } else if (destinationId === 'previous') {-->
<!--    if (currentStep.value > 0) {-->
<!--      currentStep.value&#45;&#45;-->
<!--    } else {-->
<!--      emit('close')-->
<!--    }-->
<!--  } else if (typeof destinationId === 'string') {-->
<!--    currentStep.value = findStepById(destinationId)-->
<!--  } else if (typeof destinationId === 'function') {-->
<!--    currentStep.value = findStepById(destinationId())-->
<!--  }-->

<!--  if (currentStep.value >= 0) {-->
<!--    updateHistory(currentStep.value)-->
<!--  }-->
<!--}-->

<!--const findStepById = (id: string): number => props.steps.findIndex((step) => step.id === id)-->

<!--const onNext = transitToNext-->
<!--const onBack = transitToPrevious-->
<!--const onClose = () => emit('close')-->

<!--const componentEmits = {-->
<!--  next: onNext,-->
<!--  back: onBack,-->
<!--  close: onClose,-->
<!--  'update:componentProps': (value: T) => {-->
<!--    componentProps.value = value-->
<!--    return emit('update:componentProps', value)-->
<!--  },-->
<!--}-->

<!--const reset = () => {-->
<!--  currentStep.value = 0-->
<!--  updateHistory(currentStep.value)-->
<!--}-->
<!--defineExpose({ reset })-->

<!--const handlePopState = (event: PopStateEvent) => {-->
<!--  if (event.state && typeof event.state.step === 'number') {-->
<!--    currentStep.value = event.state.step-->
<!--  }-->
<!--}-->

<!--const updateHistory = (step: number) => {-->
<!--  // if (window?.location?.href == null) return-->
<!--  // const url = new URL(window.location.href)-->
<!--  // url.searchParams.set('step', step.toString())-->
<!--  // todo: find other solution. This causes conflicts with Vike-->
<!--  // window.history.pushState({ step }, '', url.toString())-->
<!--}-->

<!--onMounted(() => {-->
<!--  window.addEventListener('popstate', handlePopState)-->

<!--  const urlParams = new URLSearchParams(window.location.search)-->
<!--  const initialStep = parseInt(urlParams.get('step') || '0', 10)-->
<!--  currentStep.value =-->
<!--    isNaN(initialStep) || initialStep < 0 || initialStep >= props.steps.length ? 0 : initialStep-->
<!--  updateHistory(currentStep.value)-->
<!--})-->

<!--onUnmounted(() => {-->
<!--  window.removeEventListener('popstate', handlePopState)-->
<!--})-->
<!--</script>-->
