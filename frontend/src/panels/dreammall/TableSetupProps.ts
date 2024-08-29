import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'

export type TableSetupProps = {
  submitText: string
  myTableSettings: MyTableSettings
}

export type TableSetupEmits = {
  (e: 'next'): void
  (e: 'submit'): void
  (e: 'custom', stepId: string): void
  (e: 'tableName:updated', value: string): void
  (e: 'isPublic:updated', value: boolean): void
  (e: 'users:updated', value: number[]): void
}
