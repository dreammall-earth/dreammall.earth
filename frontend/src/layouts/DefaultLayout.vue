<template>
  <v-main class="bg-background main-layout">
    <!-- Top Menu -->
    <v-app-bar flat class="app-bar" height="70">
      <v-row class="ma-1">
        <v-col class="d-none d-md-flex align-center">
          <a href="/" class="logo">
            <LogoImage size="small" />
          </a>
        </v-col>
        <v-col class="d-flex align-center justify-center">
          <TabControl />
        </v-col>
        <v-col class="d-none d-md-flex align-center">
          <v-row>
            <v-col class="d-flex align-center">
              <LightDarkSwitch class="d-none d-lg-flex" />
            </v-col>
            <v-col class="d-flex align-center justify-end">
              <button @click="toggleDrawer">
                <Circle>
                  <v-icon icon="$camera"></v-icon>
                </Circle>
              </button>
              <UserInfo class="ml-2" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
    <TablesDrawer
      v-model="isTablesDrawerVisible"
      :location="$vuetify.display.smAndDown ? 'bottom' : 'right'"
    />

    <!-- Large DreamMall Button -->
    <v-container fluid class="page-container px-8">
      <slot>
        <div class="dream-mall-button-container">
          <div>
            <v-container fluid class="pa-0">
              <div class="button-wrapper">
                <LargeDreamMallButton @click="toggleButtonList" />
                <transition-group name="fade" tag="div" class="button-list-desktop">
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
      </slot>
    </v-container>

    <!-- MobileButtonList -->
    <div
      class="button-list-mobile d-md-none"
      :class="[isButtonListVisible ? 'button-list-mobile--active' : '']"
    >
      <v-img class="w-100 menu-divider" :src="Divider" />
      <v-img
        class="w-100 menu-triangle"
        :class="[isButtonListVisible ? 'menu-triangle--turned' : '']"
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

    <div class="bottom-menu w-100 position-fixed bottom-0 py-2 d-md-none">
      <button class="camera-button mx-auto" @click="toggleDrawer">
        <Circle>
          <v-icon icon="$camera"></v-icon>
        </Circle>
      </button>
      <SmallDreamMallButton
        class="mx-auto"
        :is-active="isButtonListVisible"
        @click="toggleButtonList"
      />
      <UserInfo class="mx-auto" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

import Divider from '#assets/img/divider.svg'
import Triangle from '#assets/img/triangle.svg'
import LargeDreamMallButton from '#components/buttons/LargeDreamMallButton.vue'
import MainButton from '#components/buttons/MainButton.vue'
import SmallDreamMallButton from '#components/buttons/SmallDreamMallButton.vue'
import Circle from '#components/menu/CircleElement.vue'
import LightDarkSwitch from '#components/menu/LightDarkSwitch.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'
import { JoinMyTableMutationResult, joinMyTableMutation } from '#mutations/joinMyTableMutation'
import GlobalErrorHandler from '#plugins/globalErrorHandler'

const isTablesDrawerVisible = defineModel<boolean>()

const toggleDrawer = () => {
  isTablesDrawerVisible.value = !isTablesDrawerVisible.value
}

const isButtonListVisible = ref(false)

const toggleButtonList = () => {
  isButtonListVisible.value = !isButtonListVisible.value
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

.app-bar {
  background: transparent !important;
}

.logo {
  width: 140px;
}

.dream-mall-button-container {
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

.button-list-desktop {
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

.bottom-menu {
  bottom: 0;
  left: 0;
  z-index: 3000;
  display: grid;
  grid-template-columns: repeat(3, 33.3333%);
  background: var(--v-bottom-menu-background);
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;

  .camera-button {
    transform: translateX(20px);
  }
}

.small-dream-mall-button {
  z-index: 1;
  transform: translate(20px, 30px);
}
</style>
