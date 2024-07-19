<template>
  <v-navigation-drawer
    v-model="isVisible"
    :location="location"
    width="auto"
    class="menu-drawer px-4"
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
      <TableList v-else :items="filteredItems" @open-room="closeDrawer" />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

import { useRoomsStore } from '#stores/roomsStore'

import TableList from './TableList.vue'

const roomsStore = useRoomsStore()

const { rooms: items } = storeToRefs(roomsStore)

withDefaults(
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
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

.menu-drawer {
  top: 0 !important;
  z-index: 1006 !important;
  width: 308px;
  height: 100% !important;
  padding-top: 70px;
  background: var(--v-sidebar-background) !important;
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
    border-radius: 20px 0px 0px 20px;
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
