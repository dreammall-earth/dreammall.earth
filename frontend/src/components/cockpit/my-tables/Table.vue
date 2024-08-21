<template>
  <li class="table">
    <div class="table-info bg-dropdown-background">
      <span class="name">{{ props.name }}</span>
      <span class="subtitle">
        {{ $t('cockpit.myTables.memberCount', { count: props.memberCount }) }}
      </span>
    </div>
    <button class="action" @click="openTable">
      <v-icon class="camera-icon" icon="$camera" />
    </button>
    <button class="options" @click="toggleOptions">
      <v-icon
        class="options-icon"
        :class="{ turned: isShowingOptions }"
        icon="mdi mdi-dots-horizontal"
      />
    </button>
    <TransitionGroup name="options">
      <ul v-if="isShowingOptions" class="options-list">
        <li>
          <button>Edit</button>
        </li>
      </ul>
    </TransitionGroup>
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
  isShowingOptions.value = !isShowingOptions.value
}
</script>

<style scoped lang="scss">
.table {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  position: relative;
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

.camera-icon {
  transform: scale(0.8);
}

.options-icon {
  transform: rotate(0);
  transition: transform 0.3s;
  &.turned {
    transform: rotate(90deg);
  }
}

.options-list {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: calc(100% - 30px);
  display: flex;
  flex-flow: column;
  gap: 8px;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  list-style: none;
}

.options-move, /* apply transition to moving elements */
.options-enter-active,
.options-leave-active {
  transition: all 0.3s ease;
}

.options-enter-from,
.options-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.options-leave-active {
  position: absolute;
}
</style>
