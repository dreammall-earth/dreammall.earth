<template>
  <CockpitLayout>
    <CockpitCard>
      <template #header>
        <h2>
          {{ $t('sepaIban.title') }}
        </h2>
      </template>
      <template #default>
        <p>
          {{ $t('sepaIban.introduction') }}
        </p>
        <p class="pt-4">
          {{ $t('sepaIban.explanation') }}
        </p>
        <p class="pt-4">
          {{ $t('sepaIban.qr-explanation') }}
        </p>
      </template>
    </CockpitCard>
    <CockpitCard>
      <template #header>
        <h2>{{ $t('sepaIban.table-header') }}</h2>
      </template>
      <template #default>
        <v-table>
          <tbody>
            <tr>
              <td class="text-start">
                <strong>{{ $t('sepaIban.accountHolder') }}</strong>
              </td>
              <td class="text-start">{{ props.accountData.ACCOUNT_HOLDER }}</td>
            </tr>

            <tr>
              <td class="text-start">
                <strong>IBAN</strong>
              </td>
              <td class="text-start">{{ props.accountData.IBAN }}</td>
            </tr>

            <tr>
              <td class="text-start">
                <strong>BIC</strong>
              </td>
              <td class="text-start">{{ props.accountData.BIC }}</td>
            </tr>

            <tr>
              <td class="text-start">
                <strong>{{ $t('sepaIban.amount') }}</strong>
              </td>
              <td class="text-start"><input v-model="amount" type="number" min="0" /></td>
            </tr>

            <tr>
              <td class="text-start">
                <strong>{{ $t('sepaIban.reference') }}</strong>
              </td>
              <td class="text-start">{{ props.reference }}</td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </CockpitCard>
    <v-card v-if="qr" class="qr-code">
      <div class="d-flex justify-center py-4">
        <VueQrcode :value="qr"></VueQrcode>
      </div>
    </v-card>
  </CockpitLayout>
</template>

<script lang="ts" setup>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { ref, computed, defineProps } from 'vue'

import CockpitCard from '#components/cockpit/cockpit-card/CockpitCard.vue'
import CockpitLayout from '#components/cockpit/cockpit-layout/CockpitLayout.vue'

import { generateQrCode } from './qrCode'

import type { ACCOUNTING } from '#src/env'

const amount = ref(30)

const props = defineProps<{
  accountData: typeof ACCOUNTING
  reference: string
}>()

const qr = computed(() => {
  const data = {
    name: props.accountData.ACCOUNT_HOLDER,
    iban: props.accountData.IBAN,
    amount: amount.value,
    unstructuredReference: props.reference,
  }
  try {
    const qr = generateQrCode(data)
    return qr
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Invalid QR code data.\n', error)
    return null
  }
})
</script>

<style scoped>
.qr-code {
  border-radius: 20px;
}
</style>
