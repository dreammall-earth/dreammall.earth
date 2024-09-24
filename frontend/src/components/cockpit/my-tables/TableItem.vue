<template>
  <li class="table">
    <div
      class="table-info bg-dropdown-background animate-fade-out"
      :class="{ hidden: isShowingOptions }"
    >
      <span class="name">{{ props.name }}</span>
      <span class="subtitle">
        {{
          $t(
            props.moderatorCount
              ? 'cockpit.myTables.moderatorCount'
              : 'cockpit.myTables.memberCount',
            { count: props.moderatorCount ? props.moderatorCount : props.memberCount },
          )
        }}
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
      <OptionButton red @click="deleteTable">
        <v-icon icon="mdi mdi-trash-can-outline" />
        {{ $t('cockpit.myTables.delete') }}
      </OptionButton>
      <OptionButton @click="invite">
        <v-icon icon="mdi mdi-account-plus-outline" />
        {{ $t('cockpit.myTables.invite') }}
      </OptionButton>
      <OptionButton disabled @click="shareTable">
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
import { ref, h } from 'vue'
import { useI18n } from 'vue-i18n'

import OptionButton from '#components/cockpit/options-list/OptionButton.vue'
import OptionsList from '#components/cockpit/options-list/OptionsList.vue'
import useModal from '#components/modal/useModal'
import { useTablesStore } from '#stores/tablesStore'

import ChangeModerators from './change-moderators/ChangeModerators.vue'
import EditTable from './edit-table/EditTable.vue'

const { setComponent } = useModal()

const tablesStore = useTablesStore()

const { t } = useI18n()

const props = defineProps<{
  id: number
  name: string
  memberCount?: number
  moderatorCount?: number
}>()

const emit = defineEmits<{
  (e: 'option-opened'): void
}>()

const isShowingOptions = ref(false)

const openTable = () => {
  navigate(`/table/${props.id}`)
}

const toggleOptions = () => {
  if (!isShowingOptions.value) {
    emit('option-opened')
  }
  isShowingOptions.value = !isShowingOptions.value
}

const editTable = () => {
  setComponent(h(EditTable, { tableId: props.id }))
}

const invite = () => {
  setComponent(h(ChangeModerators, { tableId: props.id }))
}

const shareTable = () => {
  // TODO implement
}

const deleteTable = async () => {
  if (confirm(t('cockpit.myTables.deleteConfirmation'))) {
    try {
      await tablesStore.deleteTable(props.id)
    } catch (cause) {
      throw new Error('Could not delete table', { cause })
    }
  }
}

defineExpose({
  closeOptions: () => {
    isShowingOptions.value = false
  },
})
</script>

<style scoped>
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

.animate-fade-out {
  opacity: 1;
  transition: opacity 0.3s;
}

.hidden {
  opacity: 0;
}
</style>
