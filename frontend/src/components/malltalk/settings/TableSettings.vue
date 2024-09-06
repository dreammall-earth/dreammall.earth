<template>
  <StepHeader
    v-if="steps"
    :title="steps[currentStep]?.title ?? 'unknown'"
    :is-back-button-visible="currentStep > 0"
    :is-close-button-visible="true"
    @back="onBack"
    @close="() => $emit('close')"
  />
  <component
    :is="steps[currentStep].component"
    v-if="steps && currentStep < steps.length"
    v-model="tableSettings"
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    @next="onNext"
    @go-to="goTo"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'

import StepHeader from '#components/steps/StepHeader.vue'
import { Step, useSteps } from '#components/steps/useSteps'
import { useUserStore } from '#stores/userStore'

import ChangeUsers from './ChangeUsers.vue'
import TableSettingsRoot from './TableSettingsRoot.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'

const userStore = useUserStore()

const { getMyTable: myTable } = storeToRefs(userStore)

const tableSettings = reactive<MyTableSettings>({
  name: myTable.value?.name || '',
  isPrivate: !myTable.value?.public || false,
  users: myTable.value?.users.map((u) => u.id) || [],
})

watch(myTable, (value) => {
  tableSettings.name = value?.name || ''
  tableSettings.isPrivate = !value?.public || false
  tableSettings.users = value?.users.map((u) => u.id) || []
})

const steps: Step[] = [
  {
    component: TableSettingsRoot,
    id: 'root',
    title: 'Mein Tisch',
    submit: 'close',
    submitText: 'Beenden',
    back: 'previous',
  },
  {
    component: ChangeUsers,
    id: 'users',
    title: 'Teilnehmer',
    submit: 'root',
    submitText: 'Übernehmen',
    back: 'root',
  },
]

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { currentStep, onNext, onBack, goTo, reset } = useSteps(steps, emit)

reset()
defineExpose({ reset })
</script>
#src/panels/dreammall-button-drawer/interfaces/MyTableSettings.js
