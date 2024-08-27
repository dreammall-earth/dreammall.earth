<template>
  <li class="table">
    <div
      class="table-info bg-dropdown-background animate-fade-out"
      :class="{ hidden: isShowingOptions }"
    >
      <span class="name">{{ props.name }}</span>
      <span class="subtitle">
        {{ $t('cockpit.myTables.memberCount', { count: props.memberCount }) }}
      </span>
    </div>
    <button
      class="action animate-fade-out"
      :class="{ hidden: isShowingOptions }"
      @click="openTable"
    >
      <v-icon class="camera-icon" icon="$camera" />
    </button>
    <button class="options" @click="toggleOptions">
      <v-icon
        class="options-icon"
        :class="{ turned: isShowingOptions }"
        icon="mdi mdi-dots-horizontal"
      />
    </button>
    <OptionsList :is-visible="isShowingOptions">
      <OptionButton class="trash" @click="deleteTable">
        <v-icon icon="mdi mdi-trash-can-outline" />
        {{ $t('cockpit.myTables.delete') }}
      </OptionButton>
      <OptionButton @click="invite">
        <v-icon icon="mdi mdi-account-plus-outline" />
        {{ $t('cockpit.myTables.invite') }}
      </OptionButton>
      <OptionButton @click="shareTable">
        <v-icon icon="mdi mdi-share-variant-outline" />
        {{ $t('cockpit.myTables.share') }}
      </OptionButton>
      <OptionButton @click="editTable">
        <v-icon icon="mdi mdi-pencil-outline" />
        {{ $t('cockpit.myTables.edit') }}
      </OptionButton>
    </OptionsList>
  </li>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

import OptionButton from '#components/cockpit/options-list/OptionButton.vue'
import OptionsList from '#components/cockpit/options-list/OptionsList.vue'

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

const editTable = () => {
  // TODO implement
}

const invite = () => {
  // TODO implement
}

const shareTable = () => {
  // TODO implement
}

const deleteTable = () => {
  // TODO implement
}
</script>

<style scoped lang="scss">
.table {
  position: relative;
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

.camera-icon {
  transform: scale(0.8);
}

.options-icon {
  transition: transform 0.3s;
  transform: rotate(0);

  &.turned {
    transform: rotate(90deg);
  }
}

.trash {
  background-color: #d02f44;
}

.animate-fade-out {
  opacity: 1;
  transition: opacity 0.3s;
}

.hidden {
  opacity: 0;
}
</style>
