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
  list-style: none;
  padding: 0;
  display: flex;
  flex-flow: column;
  gap: 8px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.table-info {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 16px 0px 0px 16px;
  height: 42px;
  font-size: 13px;
  width: 100%;
}

.subtitle {
  font-size: 10px;
}

.action {
  width: 41px;
  min-width: 41px;
  height: 42px;
  border-radius: 0px 16px 16px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f09630;
  color: #fff;
}

.icon {
  transform: scale(0.8);
}
</style>
