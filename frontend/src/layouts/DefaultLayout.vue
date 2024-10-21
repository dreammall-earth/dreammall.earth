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

    <!-- Desktop Bottom Bar -->
    <div class="desktop-bottom-bar d-none d-md-flex"></div>

    <!-- Dream Mall Button & Panel -->
    <div
      class="dream-mall-floating-container"
      :class="{ active: visibleDrawer === 'dream-mall-button' }"
    >
      <div class="dream-mall-button-wrapper">
        <div class="dream-mall-button">
          <DreamMallButton
            :is-active="visibleDrawer === 'dream-mall-button'"
            :is-notification="isIncomingInvitation"
            @click="toggleDrawer('dream-mall-button')"
          />
        </div>
      </div>
      <div class="dream-mall-panel">
        <InvitationSteps
          v-if="isIncomingInvitation"
          ref="invitationStepsRef"
          @close="toggleDrawer('dream-mall-button')"
        />
        <slot v-else name="dream-mall-button" :close="() => toggleDrawer('dream-mall-button')">
          <TableSetup ref="tableSetupRef" @close="toggleDrawer('dream-mall-button')" />
        </slot>
      </div>
    </div>

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
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'

import DreamMallButton from '#components/buttons/DreamMallButton.vue'
import useDreamMallPanel from '#components/dream-mall-panel/useDreamMallPanel'
import InvitationSteps from '#components/malltalk/invitation/InvitationSteps.vue'
import TableSetup from '#components/malltalk/setup/TableSetup.vue'
import Circle from '#components/menu/CircleElement.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import ModalPanel from '#components/modal/ModalPanel.vue'
import useModal from '#components/modal/useModal'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'
import { Call, useTablesStore } from '#stores/tablesStore'

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

const isIncomingInvitation = ref<boolean>(false)
const invitationStepsRef = ref<InstanceType<typeof InvitationSteps> | null>(null)
const tableSetupRef = ref<InstanceType<typeof TableSetup> | null>(null)

const { reset: resetDreamMallPanel, setComponentRef } = useDreamMallPanel()

setComponentRef(invitationStepsRef, 'incoming-invitation')
setComponentRef(tableSetupRef, 'mall-talk-setup')

const tablesStore = useTablesStore()
const { getCurrentCall } = storeToRefs(tablesStore)

watch(getCurrentCall, (call: Call | null) => {
  resetDreamMallPanel()
  if (call && call.user?.id && call?.table) {
    isIncomingInvitation.value = true
    nextTick(() => {
      invitationStepsRef.value?.setInvitation(
        call.user.id,
        call.user.name,
        call.table.id,
        call.table.meetingName,
      )
      setDrawer('dream-mall-button')
    })
  } else {
    isIncomingInvitation.value = false
  }
})

const toggleDrawer = (drawer: DrawerType) => {
  if (visibleDrawer.value === drawer) {
    visibleDrawer.value = null
    isIncomingInvitation.value = false
  } else {
    visibleDrawer.value = drawer
    if (drawer === 'dream-mall-button' && !isIncomingInvitation.value) {
      resetDreamMallPanel()
    }
  }
}

const setDrawer = (drawer: DrawerType) => {
  if (visibleDrawer.value !== drawer) {
    visibleDrawer.value = drawer
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
  --panel-height: 500px;
  --animation-duration: 0.3s;
  --animation-timing: ease-out;

  position: fixed;
  bottom: 10px;
  left: calc(50% - var(--width) / 2);
  z-index: 5000;
  display: flex;
  flex-flow: column nowrap;
  place-content: center flex-start;
  align-items: center;
  width: var(--width);
  height: var(--button-size);
  pointer-events: none;
  transition: height var(--animation-duration) var(--animation-timing);

  .dream-mall-button-wrapper {
    z-index: 5001;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--button-size);
    height: var(--button-size);
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
      width: calc(var(--button-size) * var(--button-scaling));
      height: calc(var(--button-size) * var(--button-scaling));
      transform: scale(var(--button-scaling));
    }
  }

  .dream-mall-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-flow: column nowrap;
    place-content: center flex-start;
    align-items: center;
    width: 100%;
    height: calc(var(--button-size) / 2);
    padding-top: 10px;
    padding-bottom: 20px;
    overflow: hidden;
    pointer-events: none;
    background-color: var(--v-dm-panel-background-color);
    backdrop-filter: blur(30px);
    border: 1px solid var(--v-dm-panel-border-color);
    border-radius: 30px;
    opacity: 0;
    transition:
      height var(--animation-duration) var(--animation-timing),
      opacity var(--animation-duration) var(--animation-timing);
  }

  &.active .dream-mall-panel {
    height: var(--panel-height);
    pointer-events: all;
    opacity: 1;
  }

  @media #{map.get($display-breakpoints, 'sm-and-down')} {
    --width: 100vw;
    --panel-height: 75vh;

    bottom: 0;
    left: 0;

    &.active {
      height: calc(var(--panel-height) + var(--button-size));
    }

    .dream-mall-panel {
      border-radius: 30px 30px 0 0;
    }

    .dream-mall-button {
      transform: translateY(-10px);
    }

    &.active .dream-mall-panel {
      height: var(--panel-height);
    }
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
