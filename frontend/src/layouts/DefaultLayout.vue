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

    <!-- Page Content Container -->
    <v-container fluid class="page-container px-8">
      <slot></slot>
    </v-container>

    <!-- Desktop Bottom Bar -->
    <div class="desktop-bottom-bar d-none d-md-flex">
      <div class="dream-mall-button-container">
        <LargeDreamMallButton @click="toggleButtonList" />
      </div>
    </div>

    <!-- Universal Button List -->
    <div class="button-list" :class="[isButtonListVisible ? 'button-list--active' : '']">
      <v-img class="w-100 menu-divider" :src="Divider" />
      <v-img
        class="w-100 menu-triangle"
        :class="[isButtonListVisible ? 'menu-triangle--turned' : '']"
        :src="Triangle"
      />
      <TableSetup ref="tableSetupRef" @close="toggleButtonList" />
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
import { ref } from 'vue'

import Divider from '#assets/img/divider.svg'
import Triangle from '#assets/img/triangle.svg'
import LargeDreamMallButton from '#components/buttons/LargeDreamMallButton.vue'
import SmallDreamMallButton from '#components/buttons/SmallDreamMallButton.vue'
import Circle from '#components/menu/CircleElement.vue'
import LightDarkSwitch from '#components/menu/LightDarkSwitch.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'
import TableSetup from '#src/panels/dreammall/TableSetup.vue'

const isTablesDrawerVisible = defineModel<boolean>()

const toggleDrawer = () => {
  isTablesDrawerVisible.value = !isTablesDrawerVisible.value
}

const isButtonListVisible = ref(false)
const tableSetupRef = ref<InstanceType<typeof TableSetup> | null>(null)

const toggleButtonList = () => {
  if (isButtonListVisible.value) {
    tableSetupRef.value?.reset()
  }
  isButtonListVisible.value = !isButtonListVisible.value
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
    padding-bottom: 120px;
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

.desktop-bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  overflow: hidden; // hotfix until the concept of DreamMallButton is clarified!
  background: var(--v-bottom-menu-background);
  backdrop-filter: blur(20px);
}

.dream-mall-button-container {
  position: relative;
  width: auto;
  pointer-events: all;
}

.button-list {
  --height: 500px;
  --width: 400px;

  position: fixed;
  bottom: calc(var(--height) * -1);
  left: calc(50% - var(--width) / 2);
  z-index: 1001;
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
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      bottom: 60px;
    }

    @media #{map-get($display-breakpoints, 'md-and-up')} {
      bottom: 120px;
    }
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
</style>
