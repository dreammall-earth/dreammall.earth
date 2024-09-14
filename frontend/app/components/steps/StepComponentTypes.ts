export type StepProps = {
  submitText: string
}

export type StepEmits = {
  (e: 'next' | 'submit'): void
  (e: 'goTo', value: string): void
}
