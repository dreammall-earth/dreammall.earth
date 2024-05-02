<template>
  <button class="tabControl" :class="{ open: isOpen }" @click="toggleOpen">
    <button class="item" :class="{ active: activeItem === 1 }" @click="activeItem = 1">
      <div class="icon"><v-img class="w-100" :src="WorldCafeIcon" /></div>
      Weltencafe
    </button>
    <button class="item" :class="{ active: activeItem === 2 }" @click="activeItem = 2">
      <div class="icon"><v-img class="w-100" :src="MallIcon" /></div>
      Mall
    </button>
    <button class="item" :class="{ active: activeItem === 3 }" @click="activeItem = 3">
      <div class="icon"><v-img class="w-100" :src="CockpitIcon" /></div>
      Cockpit
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
.icon {
  display: flex;
  width: 30px;
  height: 30px;
  padding: 5px;
  margin-right: 2px;
  transition:
    margin-right var(--animation-time),
    background var(--animation-time);
}

.tabControl {
  --animation-time: 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 27.067px;
  border: 0.677px solid rgba(255, 255, 255, 0.78); // TODO use color variable
  background: #e1e6ed; // TODO use color variable

  &.open {
    .item {
      display: flex;
      &.active {
        border-radius: 27.067px;
        border: 0.677px solid rgba(255, 255, 255, 0.78);
        background: #fff;

        .icon {
          background: #e1e6ed;
          border-radius: 50%;
        }
      }
    }
  }

  &:not(.open) {
    .item {
      display: flex;
    }
    .item:not(.active) {
      display: none;
    }
  }
}

.item {
  align-items: center;
  padding: 10px;
  width: fit-content; // TODO calculate width
  &.active {
    border-radius: 27.067px;
    border: 0.677px solid rgba(255, 255, 255, 0.78);
    background: #fff;

    .icon {
      background: #e1e6ed;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
</style>
