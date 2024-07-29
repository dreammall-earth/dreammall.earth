<template>
  <div class="create-button-container">
    <div>
      <v-container fluid class="pa-0">
        <div class="button-wrapper">
          <LargeDreamMallButton @click="toggleButtonList" />
          <transition-group name="fade" tag="div" class="button-list">
            <MainButton
              v-if="isButtonListVisible"
              key="1"
              class="new-project-button"
              variant="fourth"
              label="New Project"
              size="auto"
              icon="plus"
              >{{ $t('buttons.newProject') }}
            </MainButton>
            <MainButton
              v-if="isButtonListVisible"
              key="2"
              class="new-table-button"
              variant="primary"
              label="New Table"
              size="auto"
              icon="plus"
              @click="enterTable"
              >{{ $t('buttons.newTable') }}
            </MainButton>
            <MainButton
              v-if="isButtonListVisible"
              key="3"
              class="assistant-button"
              variant="gradient"
              label="Assistant"
              size="auto"
              icon="ear-hearing"
              >{{ $t('buttons.toAssistant') }}
            </MainButton>
          </transition-group>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

import LargeDreamMallButton from '#components/buttons/LargeDreamMallButton.vue'
import MainButton from '#components/buttons/MainButton.vue'
import { JoinMyTableMutationResult, joinMyTableMutation } from '#mutations/joinMyTableMutation'
import GlobalErrorHandler from '#plugins/globalErrorHandler'

const isButtonListVisible = ref(false)

const toggleButtonList = () => {
  try {
    isButtonListVisible.value = !isButtonListVisible.value
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while MobileCreateButton click', error)
  }
}

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
@import '#root/src/assets/scss/style';

.create-button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  pointer-events: none;
  transform: translate(-50%, -50%);

  @media screen and (max-width: $tablet) {
    display: none;
  }
}

.button-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.button-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  pointer-events: all;
  transform: scale(0.5);

  .assistant-button,
  .new-project-button,
  .new-table-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    transition-delay: 0.1s;

    :deep(i) {
      display: flex;
      align-items: center;
      margin-right: 8px;
    }
  }

  .assistant-button {
    transition-delay: 0.2s;
  }

  .new-project-button {
    transition-delay: 0s;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-100px) scale(0.8);
}
</style>
