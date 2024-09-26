<template>
  <v-navigation-drawer
    v-model="isVisible"
    :location="location"
    mobile
    class="menu-drawer px-4"
    :class="[{ 'changing-orientation': isChangingOrientation }]"
    :width="308"
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

    <!-- Coffee time -->
    <TableListItem
      v-if="tables.permanent"
      :item="tables.permanent"
      class="mb-4"
      @open-table="openTable(tables.permanent.id)"
    />

    <!-- Mall Talk -->
    <div class="lists">
      <TableList
        v-for="list in lists"
        :key="list.type"
        :list="list"
        :search-value="searchValue"
        @open-table="closeDrawer"
      >
        <button
          v-if="list.type === 'mallTalk'"
          class="invite-button bg-primary pl-3 pr-6 py-1 d-flex align-center justify-center mb-4"
          @click="$emit('mall-talk-invite')"
        >
          <v-icon icon="mdi mdi-plus" class="mr-4" />
          {{ $t('tablesDrawer.invite') }}
        </button>
      </TableList>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { navigate } from 'vike/client/router'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTablesStore } from '#stores/tablesStore'

import TableList from './TableList.vue'
import TableListItem from './TableListItem.vue'

const { t } = useI18n()

defineEmits<{
  (e: 'mall-talk-invite'): void
}>()

const tablesStore = useTablesStore()

const { getTables } = storeToRefs(tablesStore)

const tables = computed(() => ({
  permanent: getTables.value.permanentTables[0],
  mallTalk: getTables.value.mallTalkTables,
  projects: getTables.value.projectTables,
}))

const lists = computed(() => [
  {
    type: 'mallTalk' as const,
    heading: t('tablesDrawer.mallTalk'),
    items: tables.value.mallTalk,
  },
  {
    type: 'projects' as const,
    heading: t('tablesDrawer.projects'),
    items: tables.value.projects,
  },
])

const props = withDefaults(
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

const currentLocation = ref(props.location)
const isChangingOrientation = ref(false)

watch(
  () => props.location,
  (newLocation) => {
    if (newLocation !== currentLocation.value && !isVisible.value) {
      isChangingOrientation.value = true
      setTimeout(() => {
        currentLocation.value = newLocation
        isChangingOrientation.value = false
      }, 50) // Adjust this delay as needed
    } else {
      currentLocation.value = newLocation
    }
  },
)

const openTable = (id: number) => {
  closeDrawer()
  navigate(`/table/${id}`)
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.menu-drawer {
  top: 0 !important;
  height: 100% !important;
  padding-top: 70px;
  background: var(--v-sidebar-background) !important;
  transition:
    transform 0.3s ease,
    width 0.3s ease,
    opacity 0.3s ease;
}

.changing-orientation {
  opacity: 0 !important;
  transition: none !important;
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  .menu-drawer {
    left: var(--sides) !important;
    z-index: 2000 !important;
    width: calc(100% - (2 * var(--sides))) !important;
    padding-top: 20px;
    border-radius: 30px 30px 0 0;

    --sides: 12px;
  }
}

@media #{map.get($display-breakpoints, 'md-and-up')} {
  .menu-drawer {
    border-radius: 20px 0 0 20px;
  }
}

.search {
  :deep(.v-input__control) {
    border: 1px solid rgb(var(--v-theme-font));
    border-radius: 20px;
  }

  :deep(.v-field--variant-solo) {
    background-color: transparent !important;
  }
}

.lists {
  display: flex;
  flex-flow: column;
  gap: 16px;
}

.invite-button {
  font-size: 14px;
  color: white !important;
  border-radius: 20px;
}
</style>
