<template>
  <v-card class="payment-link" :title="$t('payment-link.title')">
    <v-card-text>
      {{ $t('payment-link.subtitle') }}
    </v-card-text>
    <v-btn href="/payment" color="primary" block border>
      {{ $t('payment-link.call-to-action') }}
    </v-btn>
  </v-card>
</template>

<style scoped>
.payment-link {
  border-radius: 20px;
}
</style>
