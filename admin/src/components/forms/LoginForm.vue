<template>
  <v-sheet class="mx-auto" width="300">
    <v-img
      class="bg-grey-lighten-2"
      height="125"
      src="src/assets/img/dreammall-logo.svg"
    ></v-img>
    <h2 class="text-center my-4">Adminbereich</h2>
    <hr>
    <v-form @submit.prevent="login">
      <v-text-field
        v-model="username"
        label="Benutzername"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Passwort"
        type="password"
      ></v-text-field>

      <v-btn class="mt-4" type="submit" block color="primary">Anmelden</v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '#stores/auth';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const login = async () => {
  try {
    await authStore.login();
    // Verwenden Sie die Vike-Navigation
    window.location.href = '/app';
  } catch (error) {
    console.error('Anmeldefehler:', error);
  }
};
</script>