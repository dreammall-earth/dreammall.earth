<template>
  <v-card flat class="payment-link" :title="$t('paymentLink.title')">
    <v-card-text>
      {{ $t('paymentLink.subtitle') }}
    </v-card-text>
    <v-btn href="/app/cockpit/payment" color="primary" block border>
      {{ $t('paymentLink.callToAction') }}
    </v-btn>
  </v-card>
</template>

<style scoped>
.payment-link {
  border-radius: 20px;
}
</style>
