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

    <!-- Mall Talk -->
    <v-list v-for="list in lists" :key="list.heading">
      <h2 class="header mb-4">{{ list.heading }}</h2>
      <button
        v-if="list.type === 'mallTalk'"
        class="invite-button bg-primary pl-3 pr-6 py-1 d-flex align-center justify-center mb-4"
        @click="$emit('mall-talk-invite')"
      >
        <v-icon icon="mdi mdi-plus" class="mr-4" />
        {{ $t('tablesDrawer.invite') }}
      </button>
      <div v-if="!list.items.length">{{ $t('tablesDrawer.noTables') }}</div>
      <div v-else-if="!list.filteredItems.value.length">
        {{ $t('tablesDrawer.noResults') }}
      </div>
      <TableList
        v-else
        :items="list.filteredItems.value"
        :type="list.type"
        @open-table="closeDrawer"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { OpenTable, useTablesStore } from '#stores/tablesStore'

import TableList from './TableList.vue'

const { t } = useI18n()

defineEmits<{
  (e: 'mall-talk-invite'): void
}>()

const tablesStore = useTablesStore()

const { getOpenTables: mallTalk } = storeToRefs(tablesStore)

const tables = computed(() => ({
  permanent: undefined,
  mallTalk: mallTalk.value,
  projects: [
    {
      id: 1,
      meetingName: 'Project 1',
      type: 'project',
      amIModerator: true,
      participantCount: 4,
      attendees: [
        {
          fullName: 'John Doe',
        },
        {
          fullName: 'Jane Doe',
        },
      ],
    },
    {
      id: 2,
      meetingName: 'Project 2',
      type: 'project',
      amIModerator: false,
      participantCount: 30,
      attendees: [
        {
          fullName: 'Max',
        },
        {
          fullName: 'Sabrina',
        },
      ],
    },
  ] as OpenTable[],
}))

const lists = computed(() =>
  [
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
  ].map((list) => ({
    ...list,
    filteredItems: computed(() => {
      if (!searchValue.value) {
        return list.items
      }
      return list.items.filter(
        (item) =>
          item.meetingName.toLowerCase().includes(searchValue.value.toLowerCase()) ||
          item.attendees.find((attendee) =>
            attendee.fullName.toLowerCase().includes(searchValue.value.toLowerCase()),
          ),
      )
    }),
  })),
)

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
    border: 1px solid rgb(var(--v-theme-icon));
    border-radius: 20px;
  }

  :deep(.v-field--variant-solo) {
    background-color: transparent !important;
  }
}

.header {
  font-size: 14px;
  text-transform: uppercase;
}

.invite-button {
  font-size: 14px;
  color: white !important;
  border-radius: 20px;
}
</style>
