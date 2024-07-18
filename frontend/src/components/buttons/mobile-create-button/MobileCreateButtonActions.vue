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
      @click="enterRoom"
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
import { JoinMyRoomMutationResult, joinMyRoomMutation } from '#mutations/joinMyRoomMutation'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useActiveRoomStore } from '#stores/activeRoomStore'

defineProps<{
  isVisible: boolean
}>()

const activeRoomStore = useActiveRoomStore()

const { mutate: joinMyRoomMutationResult } = useMutation<JoinMyRoomMutationResult>(
  joinMyRoomMutation,
  {
    fetchPolicy: 'no-cache',
  },
)

const enterRoom = async () => {
  try {
    const result = await joinMyRoomMutationResult()

    if (result?.data?.joinMyRoom) {
      activeRoomStore.setActiveRoom(result.data.joinMyRoom)
      navigate('/room/')
    } else {
      GlobalErrorHandler.error('No room found')
    }
  } catch (error) {
    GlobalErrorHandler.error('Error opening room', error)
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
