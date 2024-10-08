<template>
  <div ref="tabControl" class="tab-control ma-auto border-sm" :class="{ sliding: isSliding }">
    <div v-show="isSliding" ref="marker" class="marker"></div>
    <div class="d-flex align-center justify-center h-100 w-100">
      <button
        v-for="(item, index) in items"
        :key="item.text"
        ref="itemRefs"
        class="item"
        :class="{ active: activeItem === index }"
        @click.prevent="() => setItem(index)"
      >
        <div class="icon d-flex justify-center align-center">
          <v-icon :icon="item.icon" class="w-100" :class="item.class"></v-icon>
        </div>
        {{ $t(item.text) }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { onMounted, ref } from 'vue'

import { usePageContext } from '#root/renderer/context/usePageContext'

import type { Ref } from 'vue'

const pageContext = usePageContext()

const { urlPathname } = pageContext

const items = [
  {
    class: 'world-cafe',
    icon: '$world-cafe',
    text: 'menu.worldCafe',
    link: '/',
  },
  /*
  {
    class: 'mall',
    icon: '$mall',
    text: 'menu.mall',
  },
  */
  {
    class: 'cockpit',
    icon: '$cockpit',
    text: 'menu.cockpit',
    link: '/cockpit',
  },
]

const isSliding = ref(false)

let defaultItem = items.findIndex((i) =>
  i.link === '/' ? urlPathname === '/' : urlPathname.startsWith(i.link),
)
defaultItem = defaultItem < 0 ? 0 : defaultItem
const activeItem = ref(defaultItem)

const tabControl: Ref<HTMLElement | null> = ref(null)
const marker: Ref<HTMLElement | null> = ref(null)
const itemRefs = ref([] as HTMLElement[])

/**
 * Move the marker to the active item
 * @param item
 */
function moveMarker() {
  // For some reason, this function is called before the refs are set
  if (activeItem.value < 0) return

  const itemRef = itemRefs.value[activeItem.value]

  marker.value?.style.setProperty('width', `${itemRef.clientWidth}px`)
  marker.value?.style.setProperty('left', `${itemRef.offsetLeft}px`)
}

/**
 * Set the active item
 * @param item s
 */
function setItem(item: number) {
  isSliding.value = true

  activeItem.value = item

  // After the animation is done, navigate to the new route if necessary
  const itemRef = itemRefs.value[activeItem.value]
  const listener = (event: TransitionEvent) => {
    if (event.propertyName !== 'background-color') return
    itemRef.removeEventListener('transitionend', listener)
    isSliding.value = false
    navigate(items[activeItem.value].link)
  }
  itemRef.addEventListener('transitionend', listener)

  requestAnimationFrame(() => {
    // Move the marker to the active item
    moveMarker()
  })
}

onMounted(() => {
  moveMarker()
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

/*
.mall {
  transform: scale(1.1);
}
*/

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

.item:first-child {
  padding-left: 10px;
}

.item:last-child {
  padding-right: 15px;
}

.tab-control {
  --animation-time: 0.5s;
  --height: 50px;
  --background-color: #e1e6ed;
  --item-border-width: 0.677px;
  --tab-control-padding: 2px;

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
  color: #222;
  background-color: var(--background-color);
  border-color: rgb(255 255 255 / 78%) !important;
  border-radius: 27.067px;
  transition: padding var(--animation-time);

  &.sliding .item {
    background-color: transparent;
    border-color: transparent;
  }
}
</style>
