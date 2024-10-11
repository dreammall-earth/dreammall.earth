export type StepProps = {
  submitText: string
}

export type StepEmits = {
  (e: 'next' | 'submit' | 'close'): void
  (e: 'goTo', value: string): void
}
