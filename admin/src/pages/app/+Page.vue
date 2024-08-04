<template>
  <DefaultLayout>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      right
      width="400"
    >
      <v-list-item v-if="selectedItem">
        <v-list-item-avatar>
          <v-icon size="large">mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ selectedItem.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ selectedItem.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense v-if="selectedItem">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Email</v-list-item-title>
            <v-list-item-subtitle>{{ selectedItem.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Telefon</v-list-item-title>
            <v-list-item-subtitle>{{ selectedItem.phone }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Adresse</v-list-item-title>
            <v-list-item-subtitle>{{ selectedItem.address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container fluid v-if="authStore.$state.isLoggedIn">
      <v-row align="center">
        <v-col cols="6">
          <v-text-field
            v-model="searchQuery"
            label="Suche"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="currentPage = 1"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn icon @click="toggleView('list')" :color="isListView ? 'primary' : ''">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
          <v-btn icon @click="toggleView('grid')" :color="!isListView ? 'primary' : ''">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    
    <v-container fluid v-if="authStore.$state.isLoggedIn">
      <v-row :dense="!isListView">
        <v-col
          v-for="item in paginatedFilteredItems"
          :key="item.id"
          :cols="isListView ? 12 : 3"
        >
          <v-card @click="openDrawer(item)">
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ item.subtitle }}</v-card-subtitle>
            <v-card-text>{{ isListView ? item.fullText : item.shortText }}</v-card-text>
            <v-card-actions v-if="isListView">
              <v-btn>Action</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-pagination
      v-if="authStore.$state.isLoggedIn"
      v-model="currentPage"
      :length="totalPages"
      @update:modelValue="updatePage"
    ></v-pagination>
    <div v-if="authStore.$state.isLoggedIn"></div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { useAuthStore } from '#stores/auth'

const authStore = useAuthStore()


interface Item {
  id: number;
  title: string;
  subtitle: string;
  shortText: string;
  fullText: string;
  email: string;
  phone: string;
  address: string;
}

const isListView = ref(false);
const currentPage = ref(1);
const itemsPerPage = 15;
const searchQuery = ref('');
const drawer = ref(false);
const selectedItem = ref<Item | null>(null);

const toggleView = (view: 'list' | 'grid') => {
  isListView.value = view === 'list';
};

const openDrawer = (item: Item) => {
  selectedItem.value = item;
  drawer.value = true;
};

// Generate 150 test entries
const items: Item[] = Array.from({ length: 150 }, (_, index) => ({
  id: index + 1,
  title: `User ${index + 1}`,
  subtitle: `Role: ${index % 3 === 0 ? 'Admin' : 'User'}`,
  shortText: 'Short user description',
  fullText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  email: `user${index + 1}@example.com`,
  phone: `+1 555-${String(index + 1).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
  address: `${index + 1} Main St, City, Country`
}));

const filteredItems = computed(() => {
  if (!searchQuery.value) return items;
  const query = searchQuery.value.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.subtitle.toLowerCase().includes(query) ||
    item.fullText.toLowerCase().includes(query)
  );
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage));

const paginatedFilteredItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const updatePage = (page: number) => {
  currentPage.value = page;
};
</script>