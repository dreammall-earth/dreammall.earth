<template>
  <button class="tabControl" :class="{ open: isOpen }" @click="toggleOpen">
    <button class="item" :class="{ active: activeItem === 1 }" @click="activeItem = 1">
      <v-img class="w-100" :src="WorldCafeIcon" /> Weltencafe
    </button>
    <button class="item" :class="{ active: activeItem === 2 }" @click="activeItem = 2">
      <v-img class="w-100" :src="MallIcon" />Mall
    </button>
    <button class="item" :class="{ active: activeItem === 3 }" @click="activeItem = 3">
      <v-img class="w-100" :src="CockpitIcon" />Cockpit
    </button>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import CockpitIcon from '#assets/icons/cockpit.svg'
import MallIcon from '#assets/icons/mall.svg'
import WorldCafeIcon from '#assets/icons/worldCafe.svg'

const isOpen = ref(true)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const activeItem = ref(1)
</script>

<style scoped lang="scss">
.tabControl {
  width: 400px; // TODO calculate width
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 27.067px;
  border: 0.677px solid rgba(255, 255, 255, 0.78); // TODO use color variable
  background: #e1e6ed; // TODO use color variable

  &:not(.open) .item:not(.active) {
    display: none;
  }
}
</style>
