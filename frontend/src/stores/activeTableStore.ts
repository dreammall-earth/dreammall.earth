import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useActiveTableStore = defineStore(
  'activeTable',
  () => {
    const activeTable = ref<string | null>(null)

    const getActiveTable = computed(() => activeTable.value)

    const setActiveTable = (table: string | null) => {
      activeTable.value = table
    }

    return {
      activeTable,
      setActiveTable,
      getActiveTable,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActiveTableStore, import.meta.hot))
}
