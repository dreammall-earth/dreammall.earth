<template>
  <MobileCreateButtonActions :is-visible="isButtonListVisible" />
  <div class="d-md-none position-fixed mb-5 pb-5" :class="$style['navigation-drawer-box']">
    <TablesDrawer v-model="isTablesDrawerVisible" location="bottom" />
  </div>
  <div class="w-100 position-fixed bottom-0 py-2 d-md-none" :class="$style['bottom-menu']">
    <button :class="[$style['menu-item'], $style['camera-button']]" @click="toggleDrawer">
      <Circle>
        <v-icon icon="$camera"></v-icon>
      </Circle>
    </button>
    <MobileCreateButton
      :class="$style['menu-item']"
      :is-active="isButtonListVisible"
      @button-click="toggleButtonList"
    />
    <UserInfo :class="$style['menu-item']" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import MobileCreateButton from '#components/buttons/mobile-create-button/MobileCreateButton.vue'
import MobileCreateButtonActions from '#components/buttons/mobile-create-button/MobileCreateButtonActions.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'

import Circle from './CircleElement.vue'
import UserInfo from './UserInfo.vue'

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

<style module lang="scss">
.bottom-menu {
  display: grid;
  grid-template-columns: repeat(3, 33.3333%);
  bottom: 0;
  left: 0;
  z-index: 1;
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

.navigation-drawer-box {
  bottom: 65px;
}

.menu-item {
  margin-inline: auto;
}
</style>
