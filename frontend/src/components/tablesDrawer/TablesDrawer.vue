<template>
  <v-navigation-drawer v-model="isVisible" :location="location" width="auto" class="menu-drawer">
    <v-text-field
      v-model="searchValue"
      :label="$t('tablesDrawer.searchPlaceholder')"
      prepend-inner-icon="mdi-tune"
      clearable
      rounded
      variant="solo"
      class="mx-4 mt-4 search"
    ></v-text-field>
    <v-list>
      <h2 class="mx-4">{{ $t('tablesDrawer.header') }}</h2>
      <TableList :items="filteredItems" @open-room="closeDrawer" />
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

<style scoped>
.menu-drawer {
  z-index: 0 !important;
}

.search {
  border-radius: 25px;
}
</style>
