import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    login() {
      // Hier würden Sie normalerweise eine API-Anfrage zur Authentifizierung machen
      this.isLoggedIn = true
    },
    logout() {
      this.isLoggedIn = false
    },
    checkAuth() {
      // In einer echten Anwendung würden Sie hier wahrscheinlich
      // eine API-Anfrage machen, um den Token zu validieren
      // Für dieses Beispiel geben wir einfach den aktuellen Status zurück
      return this.isLoggedIn
    },
  },
  persist: true,
})
