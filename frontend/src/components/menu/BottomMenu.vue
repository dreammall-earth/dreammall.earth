<template>
  <MobileCreateButtonActions :is-visible="isButtonListVisible" />
  <div class="navigation-drawer-box d-md-none position-fixed mb-5 pb-5">
    <TablesDrawer v-model="isTablesDrawerVisible" location="bottom" />
  </div>
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

<style scoped lang="scss">
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
</style>
