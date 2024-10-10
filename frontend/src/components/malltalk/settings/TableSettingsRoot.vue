<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-row no-gutters justify="space-around">
      <v-col v-for="(button, index) in buttons" :key="index" cols="auto" class="text-center px-2">
        <v-btn
          icon
          size="x-large"
          elevation="0"
          class="round-button mb-2"
          :class="{ 'copied-indicator': button.indicator }"
          @click="button.action"
        >
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
import { computed, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import {
  IsModeratorInjection,
  IsModeratorSymbol,
} from '#components/malltalk/interfaces/IsModeratorInjection'
import { usePageContext } from '#context/usePageContext'
import { copyToClipboard } from '#src/utils/copyToClipboard'
import { useTablesStore } from '#stores/tablesStore'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { toast as Toast } from 'vue3-toastify'

const toast = inject<typeof Toast>('toast')
const copy = copyToClipboard(toast)

const { t } = useI18n()

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onClick = (stepId: string) => {
  emit('goTo', stepId)
}

const pageContext = usePageContext()

const { META } = pageContext.publicEnv

const tableId = computed(() => {
  return pageContext.routeParams?.id ? Number(pageContext.routeParams.id) : null
})

const tablesStore = useTablesStore()
const isModeratorData = inject<IsModeratorInjection>(IsModeratorSymbol, {
  isModerator: ref(false),
})

const copiedIndicator = ref(false)
let timerIndicator: ReturnType<typeof setTimeout> | null = null

const buttons = computed(() => [
  {
    icon: 'mdi-content-copy',
    text: t('dream-mall-panel.call.link'),
    indicator: copiedIndicator.value,
    action: () => {
      if (tableId.value) {
        copy(tablesStore.getJoinTableUrl(tableId.value, META.BASE_URL), t('copiedToClipboard'))
        copiedIndicator.value = true

        if (timerIndicator) clearTimeout(timerIndicator)

        timerIndicator = setTimeout(() => {
          copiedIndicator.value = false
          timerIndicator = null
        }, 3000)
      }
    },
  },
  ...(isModeratorData.isModerator.value
    ? [
        {
          icon: 'mdi-account-multiple-plus-outline',
          text: t('dream-mall-panel.call.add-user'),
          indicator: false,
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

  &.copied-indicator {
    color: rgb(var(--v-theme-dm-panel-call-action-button-indicator-color));
    background-color: rgb(var(--v-theme-dm-panel-call-action-button-indicator-background-color));
  }
}

.leave-button {
  background-color: #f44336;
}
</style>
