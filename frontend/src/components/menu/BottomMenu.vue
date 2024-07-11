<template>
  <div class="navigation-drawer-box d-md-none position-fixed mb-5 pb-5">
    <TablesDrawer v-model="isTablesDrawerVisible" location="bottom" />
  </div>
  <div
    class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface d-md-none"
  >
    <button class="camera-button" @click="toggleDrawer">
      <Circle>
        <v-icon icon="$camera"></v-icon>
      </Circle>
    </button>
    <CreateButtonMobile />
    <UserInfo />
  </div>
</template>

<script lang="ts" setup>
import CreateButtonMobile from '#components/buttons/CreateButtonMobile.vue'
import TablesDrawer from '#components/tablesDrawer/TablesDrawer.vue'

import Circle from './CircleElement.vue'
import UserInfo from './UserInfo.vue'

const isTablesDrawerVisible = defineModel<boolean>()

const toggleDrawer = () => {
  isTablesDrawerVisible.value = !isTablesDrawerVisible.value
}
</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  left: 0;
  z-index: 1;
  background: var(--v-bottom-menu-background) !important;
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
