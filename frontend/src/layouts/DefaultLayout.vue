<template>
  <v-main class="bg-background main-layout">
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
    <div class="page-container px-8">
      <slot />
    </div>
    <TablesDrawer
      v-model="isTablesDrawerVisible"
      :location="$vuetify.display.mobile ? 'bottom' : 'right'"
    />
    <MobileCreateButtonActions :is-visible="isButtonListVisible" />
    <TablesDrawer v-model="isTablesDrawerVisible" location="bottom" />
    <div class="bottom-menu w-100 position-fixed bottom-0 py-2 d-md-none">
      <button class="camera-button mx-auto" @click="toggleDrawer">
        <Circle>
          <v-icon icon="$camera"></v-icon>
        </Circle>
      </button>
      <MobileCreateButton
        class="mx-auto"
        :is-active="isButtonListVisible"
        @button-click="toggleButtonList"
      />
      <UserInfo class="mx-auto" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import MobileCreateButton from '#components/buttons/mobile-create-button/MobileCreateButton.vue'
import MobileCreateButtonActions from '#components/buttons/mobile-create-button/MobileCreateButtonActions.vue'
import Circle from '#components/menu/CircleElement.vue'
import LightDarkSwitch from '#components/menu/LightDarkSwitch.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import TabControl from '#components/menu/TabControl.vue'
import UserInfo from '#components/menu/UserInfo.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'

const isTablesDrawerVisible = defineModel<boolean>()

const toggleDrawer = () => {
  isTablesDrawerVisible.value = !isTablesDrawerVisible.value
}

const isButtonListVisible = ref(false)

const toggleButtonList = () => {
  try {
    isButtonListVisible.value = !isButtonListVisible.value
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while MobileCreateButton click', error)
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

.hide-on-mobile {
  @media #{map-get($display-breakpoints, 'md-and-down')} {
    display: none;
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

.create-button-mobile {
  z-index: 1;
  transform: translate(20px, 30px);
}
</style>
