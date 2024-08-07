<template>
  <v-navigation-drawer
    v-model="isVisible"
    :location="location"
    width="auto"
    class="menu-drawer px-4"
    :class="[{ 'changing-orientation': isChangingOrientation }]"
    :style="drawerStyle"
  >
    <v-text-field
      v-model="searchValue"
      :label="$t('tablesDrawer.searchPlaceholder')"
      prepend-inner-icon="mdi-tune"
      clearable
      rounded
      flat
      density="compact"
      variant="solo"
      class="search"
    ></v-text-field>
    <v-list>
      <h2 class="header mb-4">{{ $t('tablesDrawer.header') }}</h2>
      <div v-if="!items.length">{{ $t('tablesDrawer.noTables') }}</div>
      <div v-else-if="!filteredItems.length">
        {{ $t('tablesDrawer.noResults') }}
      </div>
      <TableList v-else :items="filteredItems" @open-table="closeDrawer" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'

import { useTablesStore } from '#stores/tablesStore'

import TableList from './TableList.vue'

const tablesStore = useTablesStore()

const { tables: items } = storeToRefs(tablesStore)

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    location?: 'right' | 'bottom' | 'left' | 'end' | 'top' | 'start'
  }>(),
  {
    modelValue: false,
    location: 'right',
  },
)

const isVisible = defineModel<boolean>()

const closeDrawer = () => {
  isVisible.value = false
}

const searchValue = ref('')

const filteredItems = computed(() => {
  if (!searchValue.value) {
    return items.value
  }
  return items.value.filter(
    (item) =>
      item.meetingName.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      item.attendees.find((attendee) =>
        attendee.fullName.toLowerCase().includes(searchValue.value.toLowerCase()),
      ),
  )
})

const currentLocation = ref(props.location)
const isChangingOrientation = ref(false)

const drawerStyle = computed(() => ({
  transition: isChangingOrientation.value ? 'none' : undefined,
}))

watch(
  () => props.location,
  (newLocation) => {
    if (newLocation !== currentLocation.value && !isVisible.value) {
      isChangingOrientation.value = true
      setTimeout(() => {
        currentLocation.value = newLocation
        isChangingOrientation.value = false
      }, 50) // Adjust this delay as needed
    } else {
      currentLocation.value = newLocation
    }
  },
)
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

.menu-drawer {
  top: 0 !important;
  width: 308px;
  height: 100% !important;
  padding-top: 70px;
  background: var(--v-sidebar-background) !important;
  transition:
    transform 0.3s ease,
    width 0.3s ease,
    opacity 0.3s ease;
}

.changing-orientation {
  opacity: 0 !important;
  transition: none !important;
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .menu-drawer {
    left: var(--sides) !important;
    z-index: 2000 !important;
    width: calc(100% - (2 * var(--sides))) !important;
    padding-top: 20px;
    border-radius: 30px 30px 0 0;

    --sides: 12px;
  }
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  .menu-drawer {
    border-radius: 20px 0 0 20px;
  }
}

.search {
  :deep(.v-input__control) {
    border: 1px solid rgb(var(--v-theme-icon));
    border-radius: 20px;
  }

  :deep(.v-field--variant-solo) {
    background-color: transparent !important;
  }
}

.header {
  font-size: 14px;
  text-transform: uppercase;
}
</style>
