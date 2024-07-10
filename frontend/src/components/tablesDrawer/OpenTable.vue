<template>
  <v-card class="mx-auto" width="400">
    <v-list lines="two">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        class="open-table"
        :title="item.meetingName"
        :subtitle="$t('rooms.participantCount', { count: item.participantCount })"
        @click="handleItemClick(item.joinLink)"
      >
        <!--
        <template v-if="item.prepend" #prepend>
          <component :is="item.prepend" v-bind="item.prependProps" />
        </template>
        -->

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

import { useActiveRoomStore } from '#stores/activeRoomStore'
import { Room } from '#stores/roomsStore'

const activeRoomStore = useActiveRoomStore()

defineProps<{
  items: Room[]
}>()

const emit = defineEmits(['openRoom'])

const handleItemClick = (link: string) => {
  emit('openRoom')
  activeRoomStore.setActiveRoom(link)
  navigate('/room/')
}
</script>

<style scoped>
.open-table {
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
