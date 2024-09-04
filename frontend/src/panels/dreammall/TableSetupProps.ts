export type TableSetupProps = {
  submitText: string
}

export type TableSetupEmits = {
  (e: 'next' | 'submit'): void
  (e: 'custom' | 'tableName:updated', value: string): void
  (e: 'isPublic:updated', value: boolean): void
  (e: 'users:updated', value: number[]): void
}
