<template>
  <button class="tabControl ma-auto" :class="{ open: isOpen }" @click="toggleOpen">
    <button class="item" :class="{ active: activeItem === 1 }" @click="activeItem = 1">
      <div class="icon d-flex justify-center align-center">
        <v-icon icon="$world-cafe" class="w-100 world-cafe"></v-icon>
      </div>
      Weltencafe
    </button>
    <button class="item" :class="{ active: activeItem === 2 }" @click="activeItem = 2">
      <div class="icon d-flex justify-center align-center">
        <v-icon icon="$mall" class="w-100 mall"></v-icon>
      </div>
      Mall
    </button>
    <button class="item" :class="{ active: activeItem === 3 }" @click="activeItem = 3">
      <div class="icon d-flex justify-center align-center">
        <v-icon icon="$cockpit" class="w-100"></v-icon>
      </div>
      Cockpit
    </button>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isOpen = ref(true)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const activeItem = ref(1)
</script>

<style scoped lang="scss">
.icon {
  width: 30px;
  height: 30px;
  padding: 5px;
  margin-right: 5px;
  border-radius: 50%;
  transition: background-color var(--animation-time);
}

.world-cafe {
  transform: scale(0.7);
}

.mall {
  transform: scale(1.1);
}

.item {
  display: flex;
  overflow: hidden;
  align-items: center;
  padding: 5px;
  max-width: 120px;
  height: calc(var(--height) - 2 * var(--tab-control-padding)); // TODO calculate height
  transition:
    height var(--animation-time),
    background-color var(--animation-time),
    max-width var(--animation-time);
  &.active {
    border-radius: 27.067px;
    border: 0.677px solid rgba(255, 255, 255, 0.78);
    background: #fff;

    .icon {
      background: #e1e6ed;
    }
  }
}

.tabControl {
  --animation-time: 0.3s;
  --height: 40px;
  height: var(--height);
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e1e6ed; // TODO use color variable
  padding: var(--tab-control-padding);
  border-radius: 27.067px;
  border: none;
  transition: padding var(--animation-time);

  &.open {
    --tab-control-padding: 2px;
    border: 0.677px solid rgba(255, 255, 255, 0.78); // TODO use color variable etc

    .item {
      &.active {
        .icon {
          background-color: #e1e6ed;
          border-radius: 50%;
        }
      }
    }
  }

  &:not(.open) {
    --tab-control-padding: 0px;
    .item.active {
      .icon {
        background: none;
        padding: 2px;
      }
    }
    .item:not(.active) {
      max-width: 0;
      padding: 0;
    }
  }
}
</style>
