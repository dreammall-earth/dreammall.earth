<template>
  <PanelHeader
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

import { Step, useSteps } from '#src/panels/composables/useSteps'
import ChangeUsers from '#src/panels/dreammall/ChangeUsers.vue'
import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'
import TableSettingsRoot from '#src/panels/dreammall/TableSettingsRoot.vue'
import PanelHeader from '#src/panels/PanelHeader.vue'
import { useUserStore } from '#stores/userStore'

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
