<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-row no-gutters justify="space-around">
      <v-col v-for="(button, index) in buttons" :key="index" cols="auto" class="text-center px-2">
        <v-btn icon size="x-large" elevation="0" class="round-button mb-2" @click="button.action">
          <v-icon>{{ button.icon }}</v-icon>
        </v-btn>
        <div class="text-caption">{{ button.text }}</div>
      </v-col>
    </v-row>
    <SimpleButton
      :label="$t('dream-mall-panel.call.leave-table')"
      class="leave-button mt-12 mb-5"
      @click="leaveTable"
    />
  </div>
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import { usePageContext } from '#context/usePageContext'
import { copyToClipboard } from '#src/utils/copyToClipboard'
import { useTablesStore } from '#stores/tablesStore'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

const { t } = useI18n()

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onClick = (stepId: string) => {
  emit('goTo', stepId)
}

const pageContext = usePageContext()
const tableId = computed(() => {
  return pageContext.routeParams?.id ? Number(pageContext.routeParams.id) : null
})

const tablesStore = useTablesStore()
const showAddAction = computed(() => {
  if (tableId.value === null) return false
  return tablesStore.isTableChangeable(tableId.value)
})

const buttons = computed(() => [
  {
    icon: 'mdi-content-copy',
    text: t('dream-mall-panel.call.link'),
    action: () => copyToClipboard(),
  },
  ...(showAddAction.value
    ? [
        {
          icon: 'mdi-account-multiple-plus-outline',
          text: t('dream-mall-panel.call.add-user'),
          action: () => onClick('users'),
        },
      ]
    : []),
])

const leaveTable = () => {
  navigate('/')
}
</script>

<style scoped lang="scss">
.round-button {
  color: rgb(var(--v-theme-dm-panel-call-action-button-color));
  background-color: rgb(var(--v-theme-dm-panel-call-action-button-background-color));
}

.leave-button {
  background-color: #f44336;
}
</style>
