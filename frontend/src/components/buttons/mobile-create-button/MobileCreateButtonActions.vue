<template>
  <div
    class="button-list-mobile d-md-none"
    :class="[isVisible ? 'button-list-mobile--active' : '']"
  >
    <v-img class="w-100 menu-divider" :src="Divider" />
    <v-img
      class="w-100 menu-triangle"
      :class="[isVisible ? 'menu-triangle--turned' : '']"
      :src="Triangle"
    />
    <MainButton
      class="assistant-button"
      variant="border-gradient"
      label="Assistant"
      size="auto"
      icon="ear-hearing"
      >{{ $t('buttons.toAssistant') }}
    </MainButton>
    <MainButton
      class="new-table-button"
      variant="border-yellow"
      label="New Table"
      size="auto"
      icon="plus"
      @click="enterTable"
      >{{ $t('buttons.newTable') }}
    </MainButton>
    <MainButton
      class="new-project-button"
      variant="border-blue"
      label="New Project"
      size="auto"
      icon="plus"
      >{{ $t('buttons.newProject') }}
    </MainButton>
  </div>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'

import Divider from '#assets/img/divider.svg'
import Triangle from '#assets/img/triangle.svg'
import MainButton from '#components/buttons/MainButton.vue'
import { JoinMyTableMutationResult, joinMyTableMutation } from '#mutations/joinMyTableMutation'
import GlobalErrorHandler from '#plugins/globalErrorHandler'

defineProps<{
  isVisible: boolean
}>()

const { mutate: joinMyTableMutationResult } = useMutation<JoinMyTableMutationResult>(
  joinMyTableMutation,
  {
    fetchPolicy: 'no-cache',
  },
)

const enterTable = async () => {
  try {
    const result = await joinMyTableMutationResult()

    if (result?.data?.joinMyTable) {
      navigate(`/table/${result.data.joinMyTable}`)
    } else {
      GlobalErrorHandler.error('No table found')
    }
  } catch (error) {
    GlobalErrorHandler.error('Error opening table', error)
  }
}
</script>

<style scoped lang="scss">
.button-list-mobile {
  --height: 220px;
  --width: 180px;

  position: fixed;
  bottom: calc(var(--height) * -1);
  left: calc(50% - var(--width) / 2);
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: start;
  width: var(--width);
  height: var(--height);
  padding-top: 30px;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
  transition: bottom 0.75s;

  &--active {
    bottom: 60px;
  }

  .menu-triangle {
    position: absolute;
    top: -95px;
    max-width: 10px;
    transition:
      0.75s transform,
      0.75s 0.25s top;
    transform-origin: center;

    &--turned {
      top: 10px;
      transition:
        0.75s rotate,
        0.5s top;
      transform: rotate(180deg);
    }
  }

  .menu-divider {
    position: absolute;
    top: 0;
    max-width: 60px;
  }

  .assistant-button {
    margin: 0 40px;
    transition-delay: 0.2s;

    :deep(i) {
      margin-right: 16px;
    }
  }

  .new-project-button {
    margin: 0 20px;
    transition-delay: 0s;
  }

  .new-table-button {
    margin: 0 20px;
    transition-delay: 0.1s;
  }
}
</style>
