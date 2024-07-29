<template>
  <v-main class="bg-background main-layout">
    <TopMenu />
    <v-container fluid class="page-container px-8">
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
    </v-container>
    <BottomMenu />
  </v-main>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

import LargeDreamMallButton from '#components/buttons/LargeDreamMallButton.vue'
import MainButton from '#components/buttons/MainButton.vue'
import BottomMenu from '#components/menu/BottomMenu.vue'
import TopMenu from '#components/menu/TopMenu.vue'
import { JoinMyTableMutationResult, joinMyTableMutation } from '#mutations/joinMyTableMutation'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useActiveTableStore } from '#stores/activeTableStore'

const isButtonListVisible = ref(false)

const toggleButtonList = () => {
  try {
    isButtonListVisible.value = !isButtonListVisible.value
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while MobileCreateButton click', error)
  }
}

const activeTableStore = useActiveTableStore()

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
      activeTableStore.setActiveTable(result.data.joinMyTable)
      navigate('/table/')
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
@import 'vuetify/lib/styles/settings/_variables';

.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: $background-color-primary;

  .page-container {
    margin-top: 70px;
  }

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    .page-container {
      margin-bottom: 50px;
    }
  }
}

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
