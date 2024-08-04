<template>
  <DefaultLayout>
    <div v-if="!authStore.$state.isLoggedIn" class="mt-5">
      <LoginForm />
    </div>
    <div v-if="authStore.$state.isLoggedIn" class="mt-5 text-center">
      <h1>Willkommen im Adminbereich</h1>
      <v-link >
      <v-card class="mt-5" href="/app">      
        <v-card-title >
            Userübersicht
        </v-card-title>
      </v-card>
    </v-link>
    </div>
    
  </DefaultLayout>
</template>
<script lang="ts" setup>
import DefaultLayout from '#layouts/DefaultLayout.vue'
import LoginForm from '#components/forms/LoginForm.vue'
import { useAuthStore } from '#stores/auth'

const authStore = useAuthStore()
</script>
