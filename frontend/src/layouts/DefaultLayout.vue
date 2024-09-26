<template>
  <v-main class="bg-background main-layout" :class="{ 'modal-active': isModalActive }">
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
            <v-col class="d-flex align-center justify-end">
              <button class="test-desktop-camera-button" @click="toggleDrawer('tables')">
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

    <ModalPanel />

    <!-- Page Content Container -->
    <v-container fluid class="page-container px-8 text-font">
      <slot></slot>
    </v-container>

    <!-- Desktop Bottom Bar -->
    <div class="desktop-bottom-bar d-none d-md-flex"></div>

    <!-- Dream Mall Button & Panel -->
    <div class="dream-mall-floating-container" :class="{ active: isDmPanelVisible }">
      <div class="dream-mall-button-wrapper">
        <div class="dream-mall-button">
          <DreamMallButton :is-active="isDmPanelVisible" @click="toggleDmPanel" />
        </div>
      </div>
      <div class="dream-mall-panel">
        <slot name="dream-mall-button" :close="toggleDmPanel">
          <TableSetup ref="tableSetupRef" @close="toggleDmPanel" />
        </slot>
      </div>
    </div>

    <div class="bottom-menu w-100 position-fixed bottom-0 py-2 d-md-none">
      <button
        class="test-mobile-camera-button camera-button mx-auto"
        @click="() => toggleDrawer('tables')"
      >
        <Circle>
          <v-icon icon="$camera"></v-icon>
        </Circle>
      </button>
      <div class="mx-auto" />
      <UserInfo class="mx-auto" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import DreamMallButton from '#components/buttons/DreamMallButton.vue'
import TableSetup from '#components/malltalk/setup/TableSetup.vue'
import Circle from '#components/menu/CircleElement.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import ModalPanel from '#components/modal/ModalPanel.vue'
import useModal from '#components/modal/useModal'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'

type DrawerType = 'tables' | 'dream-mall-button' | null

const visibleDrawer = ref<DrawerType>(null)
const isDmPanelVisible = ref(false)

const isTablesDrawerVisible = computed({
  get() {
    return visibleDrawer.value === 'tables'
  },
  set() {
    toggleDrawer('tables')
  },
})

const tableSetupRef = ref<InstanceType<typeof TableSetup> | null>(null)

const toggleDrawer = (drawer: DrawerType) => {
  if (visibleDrawer.value === drawer) {
    visibleDrawer.value = null
  } else {
    visibleDrawer.value = drawer
    if (drawer === 'dream-mall-button') {
      tableSetupRef.value?.reset()
    }
  }
}

const toggleDmPanel = () => {
  if (isDmPanelVisible.value) {
    isDmPanelVisible.value = false
  } else {
    isDmPanelVisible.value = true
    tableSetupRef.value?.reset()
  }
}

const { isModalActive } = useModal()
</script>

<style scoped lang="scss">
@use 'sass:map';
@import '#root/src/assets/scss/style';
@import 'vuetify/lib/styles/settings/_variables';

.main-layout {
  padding-top: 0;
  padding-right: 0;
  background: $background-color-primary;

  &.modal-active {
    pointer-events: none;
  }

  .page-container {
    padding-bottom: 120px;
    margin-top: 70px;
  }

  @media #{map.get($display-breakpoints, 'sm-and-down')} {
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
  overflow: hidden;
  background: transparent;
}

.dream-mall-floating-container {
  --width: 400px;
  --button-size: 100px;
  --button-scaling: 0.7;
  --panel-height: 200px;
  --animation-duration: 0.3s;
  --animation-timing: ease-out;

  position: fixed;
  bottom: 60px;
  left: calc(50% - var(--width) / 2);
  z-index: 3000;
  width: var(--width);
  height: var(--button-size);
  pointer-events: none;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;

  transition: height var(--animation-duration) var(--animation-timing);

  .dream-mall-button-wrapper {
    z-index: 10000;
    width: var(--button-size);
    height: var(--button-size);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform var(--animation-duration) var(--animation-timing);
  }

  .dream-mall-button {
    width: 100%;
    height: 100%;
    pointer-events: none;
    transition:
      transform var(--animation-duration) var(--animation-timing),
      width var(--animation-duration) var(--animation-timing),
      height var(--animation-duration) var(--animation-timing);
  }

  &.active {
    height: calc(var(--panel-height) + var(--button-size));

    .dream-mall-button-wrapper {
      transform: translateY(calc(var(--button-size) / 2));
    }

    .dream-mall-button {
      transform: scale(var(--button-scaling));
      width: calc(var(--button-size) * var(--button-scaling));
      height: calc(var(--button-size) * var(--button-scaling));
    }
  }

  .dream-mall-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    opacity: 0;
    background-color: var(--v-dm-panel-background-color);
    backdrop-filter: blur(30px);
    border: 1px solid var(--v-dm-panel-border-color);
    border-radius: 30px;
    padding-top: 10px;
    padding-bottom: 20px;
    pointer-events: auto;
    z-index: 1000;
    overflow: hidden;
    transition:
      height var(--animation-duration) var(--animation-timing),
      opacity var(--animation-duration) var(--animation-timing);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  &.active .dream-mall-panel {
    height: var(--panel-height);
    opacity: 1;
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
