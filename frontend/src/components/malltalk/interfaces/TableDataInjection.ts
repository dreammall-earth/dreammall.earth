import { InjectionKey, Ref } from 'vue'

export interface TableDataInjection {
  name: Ref<string>
  isModerator: Ref<boolean>
}

export const TableDataSymbol: InjectionKey<TableDataInjection> = Symbol('ActiveTableData')
