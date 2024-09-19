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
    <v-container fluid class="page-container px-8">
      <slot></slot>
    </v-container>

    <!-- Desktop Bottom Bar -->
    <div class="desktop-bottom-bar d-none d-md-flex">
      <div class="dream-mall-button-container">
        <LargeDreamMallButton
          :is-active="visibleDrawer === 'dream-mall-button'"
          @click="() => toggleDrawer('dream-mall-button')"
        />
      </div>
    </div>

    <!-- Universal Button List -->
    <div
      class="button-list"
      :class="[visibleDrawer === 'dream-mall-button' ? 'button-list--active' : '']"
    >
      <slot name="dream-mall-button" :close="() => toggleDrawer('dream-mall-button')">
        <TableSetup ref="tableSetupRef" @close="toggleDrawer('dream-mall-button')" />
      </slot>
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
      <SmallDreamMallButton
        class="mx-auto"
        :is-active="visibleDrawer === 'dream-mall-button'"
        @click="() => toggleDrawer('dream-mall-button')"
      />
      <UserInfo class="mx-auto" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import LargeDreamMallButton from '#components/buttons/LargeDreamMallButton.vue'
import SmallDreamMallButton from '#components/buttons/SmallDreamMallButton.vue'
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

.dream-mall-button-container {
  position: relative;
  width: auto;
  pointer-events: all;
}

.button-list {
  --width: 400px;

  position: fixed;
  bottom: -100%;
  left: calc(50% - var(--width) / 2);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: start;
  width: var(--width);
  height: var(--height);
  padding-top: 10px;
  padding-bottom: 20px;
  background-color: var(--v-dm-panel-background-color);
  backdrop-filter: blur(30px);
  border: 1px solid var(--v-dm-panel-border-color);
  border-radius: 30px;
  transition: bottom 0.75s;

  &--active {
    @media #{map.get($display-breakpoints, 'sm-and-down')} {
      bottom: 90px;
    }

    @media #{map.get($display-breakpoints, 'md-and-up')} {
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
