import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'

export type TableSetupProps = {
  myTableSettings: MyTableSettings
}

export type TableSetupEmits = {
  (e: 'next'): void
  (e: 'tableName:updated', value: string): void
  (e: 'isPublic:updated', value: boolean): void
  (e: 'users:updated', value: number[]): void
}
