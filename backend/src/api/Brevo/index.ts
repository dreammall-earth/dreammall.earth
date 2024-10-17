import { createBrevoClient } from './Brevo'

export type BrevoClient = ReturnType<typeof createBrevoClient>
export { createBrevoClient }
