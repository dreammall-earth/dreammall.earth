<template>
  <button
    ref="tabControl"
    class="tab-control ma-auto border-sm text-font"
    :class="{ open: isOpen, sliding: isSliding }"
    @click="() => !isOpen && open()"
  >
    <div v-show="isSliding" ref="marker" class="marker"></div>
    <div class="d-flex align-center justify-center h-100 w-100">
      <button
        ref="item1"
        class="item"
        :class="{ active: activeItem === 1 }"
        @click="() => setItem(1)"
      >
        <div class="icon d-flex justify-center align-center">
          <v-icon icon="$world-cafe" class="w-100 world-cafe"></v-icon>
        </div>
        {{ $t('menu.worldCafe') }}
      </button>
      <button
        ref="item2"
        class="item"
        :class="{ active: activeItem === 2 }"
        @click="() => setItem(2)"
      >
        <div class="icon d-flex justify-center align-center">
          <v-icon icon="$mall" class="w-100 mall"></v-icon>
        </div>
        {{ $t('menu.mall') }}
      </button>
      <button
        ref="item3"
        class="item"
        :class="{ active: activeItem === 3 }"
        @click="() => setItem(3)"
      >
        <div class="icon d-flex justify-center align-center">
          <v-icon icon="$cockpit" class="w-100"></v-icon>
        </div>
        {{ $t('menu.cockpit') }}
      </button>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

import type { Ref } from 'vue'

const closeDelay = 3000

const isOpen = ref(true)

const isSliding = ref(false)

const activeItem = ref(1)

const tabControl: Ref<HTMLElement | null> = ref(null)

const marker: Ref<HTMLElement | null> = ref(null)

const item1: Ref<HTMLElement | null> = ref(null)
const item2: Ref<HTMLElement | null> = ref(null)
const item3: Ref<HTMLElement | null> = ref(null)

let timer: ReturnType<typeof setTimeout>

function open() {
  isOpen.value = true
  closeWithDelay()
}

function closeWithDelay() {
  timer = setTimeout(() => {
    isSliding.value = false
    isOpen.value = false
  }, closeDelay)
}

function setMarker(item: number) {
  activeItem.value = item
  const activeItemRef = activeItem.value === 1 ? item1 : activeItem.value === 2 ? item2 : item3

  marker.value?.style.setProperty('width', `${activeItemRef.value?.clientWidth}px`)
  marker.value?.style.setProperty('left', `${activeItemRef.value?.offsetLeft}px`)
}

function setItem(item: number) {
  if (!isOpen.value) return

  clearTimeout(timer)

  isSliding.value = true

  activeItem.value = item
  const activeItemRef = activeItem.value === 1 ? item1 : activeItem.value === 2 ? item2 : item3

  requestAnimationFrame(() => {
    // Move the marker to the active item

    if (activeItemRef.value?.offsetLeft === undefined) {
      throw new Error('activeItemRef.value?.offsetLeft is undefined')
    }

    setMarker(item)

    closeWithDelay()
  })
}

onMounted(() => {
  setMarker(activeItem.value)
  closeWithDelay()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped lang="scss">
.icon {
  width: 30px;
  height: 30px;
  padding: 5px;
  margin-right: 5px;
  border-radius: 50%;
  transition:
    background-color var(--animation-time),
    padding var(--animation-time);
}

.world-cafe {
  transform: scale(0.7);
}

.mall {
  transform: scale(1.1);
}

.marker {
  position: absolute;
  top: 2px;
  left: 0;
  z-index: 0;
  height: calc(100% - 2 * var(--tab-control-padding));
  background: #fff;
  border: var(--item-border-width) solid rgb(255 255 255 / 78%);
  border-radius: 27.067px;
  opacity: 1;
  transition:
    opacity cubic-bezier(1, 0, 0, 1) var(--animation-time),
    width ease-in-out 0.5s,
    left ease-in-out 0.5s;
}

.item {
  z-index: 1;
  display: flex;
  align-items: center;
  max-width: 150px;
  height: 100%;
  padding: 5px 20px;
  overflow: hidden;
  border-color: transparent;
  border-width: var(--item-border-width);
  transition:
    height var(--animation-time),
    max-width var(--animation-time),
    padding var(--animation-time);

  &.active {
    background: #fff;
    border-color: rgb(255 255 255 / 78%);
    border-radius: 27.067px;

    .icon {
      background-color: var(--background-color);
    }
  }
}

.item:first-child,
.tab-control:not(.open) .item.active {
  padding-left: 10px;
}

.item:last-child,
.tab-control:not(.open) .item.active {
  padding-right: 15px;
}

.tab-control {
  --animation-time: 0.5s;
  --height: 50px;
  --background-color: #e1e6ed;
  --item-border-width: 0.677px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--height);
  padding: var(--tab-control-padding);
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  background-color: var(--background-color);
  border-radius: 27.067px;
  transition: padding var(--animation-time);

  &.open {
    --tab-control-padding: 2px;

    border-color: rgb(255 255 255 / 78%) !important;

    .item {
      &.active {
        background-color: #fff;

        .icon {
          background-color: var(--background-color);
        }
      }
    }
  }

  &.open.sliding .item {
    background-color: transparent;
    border-color: transparent;
  }

  &:not(.open) {
    --tab-control-padding: 0px;

    .item.active {
      .icon {
        padding: 2px;
        background: none;
      }
    }

    .item:not(.active) {
      max-width: 0;
      padding: 0;
    }

    .marker {
      opacity: 0;
    }
  }
}
</style>
