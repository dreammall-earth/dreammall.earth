import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({ 
    isLoggedIn: false 
  }),
  actions: {
    async login() {
      // Hier würden Sie normalerweise eine API-Anfrage zur Authentifizierung machen
      this.isLoggedIn = true
      console.log('useAuthStore: Logged in', this.isLoggedIn)
    },
    logout() {
      this.isLoggedIn = false
      console.log('useAuthStore: Logged out', this.isLoggedIn)
    },
    async checkAuth() {
      // In einer echten Anwendung würden Sie hier wahrscheinlich
      // eine API-Anfrage machen, um den Token zu validieren
      // Für dieses Beispiel geben wir einfach den aktuellen Status zurück
      return this.isLoggedIn
    }
  },
  persist: true,
})