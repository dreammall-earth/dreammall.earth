<template>
  <ul class="list">
    <li v-for="item in items" :key="item.meetingID" class="table">
      <div class="table-info bg-dropdown-background">
        <span>{{ item.meetingName }}</span>
        <span class="subtitle">
          {{ $t('rooms.participantCount', { count: item.participantCount }) }}
        </span>
      </div>
      <button class="action" @click="openRoom(item.joinLink)">
        <v-icon class="icon" icon="$camera" />
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import { useActiveRoomStore } from '#stores/activeRoomStore'
import { Room } from '#stores/roomsStore'

const activeRoomStore = useActiveRoomStore()

defineProps<{
  items: Room[]
}>()

const emit = defineEmits(['openRoom'])

const openRoom = (link: string) => {
  emit('openRoom')
  activeRoomStore.setActiveRoom(link)
  navigate('/room/')
}
</script>

<style scoped>
.list {
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.table {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.table-info {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  height: 42px;
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 16px 0 0 16px;
}

.subtitle {
  font-size: 10px;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  min-width: 41px;
  height: 42px;
  color: #fff;
  background-color: #f09630;
  border-radius: 0 16px 16px 0;
}

.icon {
  transform: scale(0.8);
}
</style>
