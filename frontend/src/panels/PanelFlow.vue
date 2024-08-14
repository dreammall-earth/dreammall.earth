<!--<template>-->
<!--  <v-card>-->
<!--    <v-card-title>-->
<!--      <v-btn v-if="currentStep > 0" icon @click="goBack">-->
<!--        <v-icon>mdi-arrow-left</v-icon>-->
<!--      </v-btn>-->
<!--      {{ title }}-->
<!--    </v-card-title>-->
<!--    <v-card-text>-->
<!--      <component-->
<!--        :is="steps[currentStep].stepName"-->
<!--        v-bind="componentProps"-->
<!--        @next="goNext"-->
<!--      ></component>-->
<!--    </v-card-text>-->
<!--  </v-card>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { ref, computed, onMounted, onUnmounted, PropType, defineComponent } from 'vue'-->

<!--// Interface that all step components should implement-->
<!--export interface StepComponent {-->
<!--  stepName: string-->
<!--  validate?: () => boolean | Promise<boolean>-->
<!--}-->

<!--export default defineComponent({-->
<!--  name: 'FlowComponent',-->
<!--  props: {-->
<!--    steps: {-->
<!--      type: Array as PropType<StepComponent[]>,-->
<!--      required: true,-->
<!--      validator: (steps: StepComponent[]) => steps.every((step) => step.validate),-->
<!--    },-->
<!--    title: {-->
<!--      type: String,-->
<!--      default: 'Flow',-->
<!--    },-->
<!--    id: {-->
<!--      type: String,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->
<!--  setup(props) {-->
<!--    const currentStep = ref(0)-->
<!--    const flowData = ref({})-->

<!--    const componentProps = computed(() => ({-->
<!--      ...flowData.value,-->
<!--      modelValue: flowData.value,-->
<!--    }))-->

<!--    const goNext = () => {-->
<!--      if (currentStep.value < props.steps.length - 1) {-->
<!--        currentStep.value++-->
<!--        updateHistory()-->
<!--      }-->
<!--    }-->

<!--    const goBack = () => {-->
<!--      if (currentStep.value > 0) {-->
<!--        currentStep.value&#45;&#45;-->
<!--        updateHistory()-->
<!--      }-->
<!--    }-->

<!--    const updateHistory = () => {-->
<!--      const state = {-->
<!--        flowId: props.id,-->
<!--        step: currentStep.value,-->
<!--        data: JSON.parse(JSON.stringify(flowData.value)),-->
<!--      }-->
<!--      history.pushState(state, '', `#${props.id}-${currentStep.value}`)-->
<!--    }-->

<!--    const handlePopState = (event) => {-->
<!--      if (event.state && event.state.flowId === props.id) {-->
<!--        currentStep.value = event.state.step-->
<!--        flowData.value = event.state.data-->
<!--      }-->
<!--    }-->

<!--    onMounted(() => {-->
<!--      updateHistory() // Set initial history state-->
<!--      window.addEventListener('popstate', handlePopState)-->
<!--    })-->

<!--    onUnmounted(() => {-->
<!--      window.removeEventListener('popstate', handlePopState)-->
<!--    })-->

<!--    return {-->
<!--      currentStep,-->
<!--      componentProps,-->
<!--      goNext,-->
<!--      goBack,-->
<!--    }-->
<!--  },-->
<!--})-->
<!--</script>-->
