<template>
  <v-card class="mx-auto" width="400">
    <v-list lines="two">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'custom-list-item': true }"
        :title="item.meetingName"
        :subtitle="$t('rooms.participantCount', { count: item.participantCount })"
        @click="handleItemClick(item.joinLink)"
      >
        <!-- 
        <template v-if="item.prepend" #prepend>
          <component :is="item.prepend" v-bind="item.prependProps" />
        </template>
        -->

        <!-- <v-list-item-title>{{ item.title }}</v-list-item-title>
             <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle> -->
        <!-- 
        <template v-if="item.append" #append>
          <component :is="item.append" v-bind="item.appendProps" />
        </template>
        -->
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { PropType } from 'vue'

import { useActiveRoomStore } from '#stores/activeRoomStore'
import { Room } from '#stores/roomsStore'

const activeRoomStore = useActiveRoomStore()

/*
    export interface Item {
    title: string
    subtitle?: string
    rounded?: boolean
    prepend?: string | object
    prependProps?: object
    append?: string | object
    appendProps?: object
    }
  */

defineProps({
  items: {
    type: Array as PropType<Room[]>,
    required: true,
  },
})

// const emit = defineEmits(['item-click'])

const handleItemClick = (link: string) => {
  console.log('handleItemClick', link)
  closeMenu()
  activeRoomStore.setActiveRoom(link)
  navigate('/room/')
  // emit('item-click')
}
const closeMenu = () => {
  // Logik zum Schließen des Menüs hinzufügen, falls erforderlich
}
</script>

<style scoped>
.custom-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}
</style>
