<template>
  <v-navigation-drawer expand-on-hover rail location="right" permanent>
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        :subtitle="authStore.isLoggedIn ? 'Eingeloggt' : 'Nicht eingeloggt'"
        :title="authStore.isLoggedIn ? 'Benutzer' : 'Gast'"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        value="dashboard"
        href="/"
      ></v-list-item>
      <v-list-item
        v-if="authStore.isLoggedIn"
        prepend-icon="mdi-account-box"
        title="Userübersicht"
        value="users"
        href="/app"
      ></v-list-item>
      <hr />
      <v-list-item
        v-if="authStore.isLoggedIn"
        prepend-icon="mdi-logout-variant"
        title="Logout"
        value="logout"
        @click="logout"
      ></v-list-item>
      <v-list-item
        v-if="!authStore.isLoggedIn"
        prepend-icon="mdi-login-variant"
        title="Login"
        value="login"
        href="/"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAuthStore } from '#stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  // Verwenden Sie window.location für die Client-seitige Navigation
  window.location.href = '/'
}
</script>
