<template>
  <button ref="tabControl" class="tab-control ma-auto border-sm open" @click="() => {}">
    <div ref="marker" class="marker"></div>
    <div class="d-flex align-center justify-center h-100 w-100">
      <a
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
      </a>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { onMounted, ref, watch } from 'vue'

import { usePageContext } from '#root/renderer/context/usePageContext'

import type { Ref } from 'vue'

const pageContext = usePageContext()
const urlPathname = ref(pageContext.urlPathname)

const items = [
  {
    class: 'world-cafe',
    icon: '$world-cafe',
    text: 'menu.worldCafe',
    link: '/',
  },
  {
    class: 'cockpit',
    icon: '$cockpit',
    text: 'menu.cockpit',
    link: '/cockpit',
  },
]

const activeItem = ref(0)

function updateActiveItem() {
  const index = items.findIndex((i) =>
    i.link === '/' ? urlPathname.value === '/' : urlPathname.value.startsWith(i.link),
  )
  activeItem.value = index < 0 ? 0 : index
  moveMarker()
}

const tabControl: Ref<HTMLElement | null> = ref(null)
const marker: Ref<HTMLElement | null> = ref(null)
const itemRefs = ref([] as HTMLElement[])

function moveMarker() {
  if (activeItem.value < 0) return

  const itemRef = itemRefs.value[activeItem.value]

  marker.value?.style.setProperty('width', `${itemRef.clientWidth}px`)
  marker.value?.style.setProperty('left', `${itemRef.offsetLeft}px`)
}

function setItem(item: number) {
  if (activeItem.value === item) return

  const previousItem = activeItem.value
  activeItem.value = item

  moveMarker()

  // Verzögerte Navigation nur von "Cockpit" zu "Weltencafé"
  if (previousItem === 1 && item === 0) {
    const markerRef = marker.value
    if (!markerRef) return

    const listener = (event: TransitionEvent) => {
      if (event.propertyName !== 'left') return
      markerRef.removeEventListener('transitionend', listener)
      navigate(items[activeItem.value].link)
    }
    markerRef.addEventListener('transitionend', listener)
  } else {
    // Sofortige Navigation
    navigate(items[activeItem.value].link)
  }
}

onMounted(() => {
  updateActiveItem()
})

watch(
  () => pageContext.urlPathname,
  (newUrl) => {
    urlPathname.value = newUrl
    updateActiveItem()
  },
)
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
    width 0.5s ease-in-out,
    left 0.5s ease-in-out;
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
    background-color var(--animation-time),
    border-color var(--animation-time),
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
}
</style>
