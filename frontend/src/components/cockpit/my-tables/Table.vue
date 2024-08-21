<template>
  <li class="table">
    <div class="table-info bg-dropdown-background">
      <span class="name">{{ props.name }}</span>
      <span class="subtitle">
        {{ $t('cockpit.myTables.memberCount', { count: props.memberCount }) }}
      </span>
    </div>
    <button class="action" @click="openTable">
      <v-icon class="icon" icon="$camera" />
    </button>
    <button class="options" @click="toggleOptions">
      <v-icon class="icon" icon="mdi mdi-ellipsis" />
    </button>
  </li>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

const props = defineProps<{
  id: number
  name: string
  memberCount: number
}>()

const isShowingOptions = ref(false)

const openTable = () => {
  navigate(`/table/${props.id}`)
}

const toggleOptions = () => {
  isShowingOptions.value = true
}
</script>

<style scoped>
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
  padding: 5px 24px;
  border-radius: 16px 0 0 16px;
}

.name {
  height: 18px;
  font-size: 14px;
  font-weight: bold;
}

.subtitle {
  font-size: 11px;
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
