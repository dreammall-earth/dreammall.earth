import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'

export type TableSetupProps = {
  submitText: string
  myTableSettings: MyTableSettings
}

export type TableSetupEmits = {
  (e: 'next' | 'submit'): void
  (e: 'custom' | 'tableName:updated', value: string): void
  (e: 'isPublic:updated', value: boolean): void
  (e: 'users:updated', value: number[]): void
}
