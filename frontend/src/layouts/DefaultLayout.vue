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
                <Circle :is-active="visibleDrawer === 'tables'">
                  <v-icon icon="$handshake"></v-icon>
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
      @mall-talk-invite="toggleDrawer('dream-mall-button')"
    />

    <ModalPanel />

    <!-- Page Content Container -->
    <v-container fluid class="page-container text-font">
      <slot></slot>
    </v-container>

    <!-- Dream Mall Button & Panel -->
    <DreamMallPanel
      :is-visible="visibleDrawer === 'dream-mall-button'"
      @toggle="toggleDrawer('dream-mall-button')"
      @open="setDrawer('dream-mall-button')"
    />

    <div class="bottom-menu w-100 position-fixed bottom-0 py-2 d-md-none">
      <button
        class="test-mobile-camera-button camera-button mx-auto"
        @click="() => toggleDrawer('tables')"
      >
        <Circle :is-active="visibleDrawer === 'tables'">
          <v-icon icon="$handshake"></v-icon>
        </Circle>
      </button>
      <div class="mx-auto" />
      <UserInfo class="mx-auto" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import DreamMallPanel from '#components/dream-mall-panel/DreamMallPanel.vue'
import Circle from '#components/menu/CircleElement.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import ModalPanel from '#components/modal/ModalPanel.vue'
import useModal from '#components/modal/useModal'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'
import { useRedeemInvitation } from '#src/composables/useRedeemInvitation'

type DrawerType = 'tables' | 'dream-mall-button' | 'call' | null

const visibleDrawer = ref<DrawerType>(null)

const isTablesDrawerVisible = computed({
  get() {
    return visibleDrawer.value === 'tables'
  },
  set() {
    toggleDrawer('tables')
  },
})

const toggleDrawer = (drawer: DrawerType) => {
  if (visibleDrawer.value === drawer) {
    visibleDrawer.value = null
  } else {
    visibleDrawer.value = drawer
  }
}

const setDrawer = (drawer: DrawerType) => {
  if (visibleDrawer.value !== drawer) {
    visibleDrawer.value = drawer
  }
}

const { isModalActive } = useModal()

useRedeemInvitation()
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/lib/styles/settings/_variables' as variables;

.main-layout {
  padding-top: 0;
  padding-right: 0;

  &.modal-active {
    pointer-events: none;
  }

  .page-container {
    padding-bottom: 120px;
    margin-top: 70px;
  }

  @media #{map.get(variables.$display-breakpoints, 'sm-and-down')} {
    .page-container {
      padding: 16px 0;
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
