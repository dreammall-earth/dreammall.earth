<template>
  <CockpitLayout>
    <CockpitCardVariableHeight>
      <template #header>
        <h2>
          {{ $t('sepaIban.explanation.title') }}
        </h2>
      </template>
      <template #default>
        <p>
          {{ $t('sepaIban.explanation.introduction') }}
        </p>
        <p class="py-4">
          {{ $t('sepaIban.explanation.callToAction') }}
        </p>

        <template v-if="qr">
          <div class="d-flex py-8 justify-center">
            <VueQrcode :value="qr" :options="{ width: 140 }"></VueQrcode>
          </div>
          <p class="pb-4">
            {{ $t('sepaIban.qr.explanation') }}
          </p>
        </template>
        <p v-else>
          {{ $t('sepaIban.qr.invalid') }}
        </p>
      </template>
    </CockpitCardVariableHeight>
    <CockpitCardVariableHeight>
      <template #header>
        <h2>{{ $t('sepaIban.accountData.title') }}</h2>
      </template>
      <template #default>
        <v-textarea
          variant="underlined"
          rows="2"
          no-resize
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.accountHolder')"
          :model-value="accountHolder"
        ></v-textarea>
        <v-textarea
          v-if="accountHolderAddress"
          variant="underlined"
          rows="2"
          no-resize
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.accountHolderAddress')"
          :model-value="accountHolderAddress"
        ></v-textarea>
        <v-text-field
          variant="underlined"
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.IBAN')"
          :model-value="props.accountData.IBAN"
        ></v-text-field>
        <v-text-field
          variant="underlined"
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.BIC')"
          :model-value="props.accountData.BIC"
        ></v-text-field>
        <v-text-field
          v-if="props.accountData.BANK"
          variant="underlined"
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.bank')"
          :model-value="props.accountData.BANK"
        ></v-text-field>
        <v-text-field
          variant="underlined"
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.reference')"
          :model-value="props.reference"
        ></v-text-field>
        <v-text-field
          variant="underlined"
          readonly
          persistent-hint
          :label="$t('sepaIban.accountData.amount')"
          :model-value="$n(amount, { style: 'currency', currency: 'EUR' })"
        ></v-text-field>
      </template>
    </CockpitCardVariableHeight>
  </CockpitLayout>
</template>

<script lang="ts" setup>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { defineProps } from 'vue'

import CockpitCardVariableHeight from '#components/cockpit/cockpit-card/CockpitCardVariableHeight.vue'
import CockpitLayout from '#components/cockpit/cockpit-layout/CockpitLayout.vue'

import { generateQrCode } from './qrCode'

import type { PageContext } from 'vike/types'

const amount = 22.9

const props = defineProps<{
  accountData: PageContext['publicEnv']['ACCOUNTING']
  reference: string
}>()

const accountHolder = props.accountData.ACCOUNT_HOLDER.replaceAll(', ', '\n')
const accountHolderAddress = props.accountData.ACCOUNT_HOLDER_ADDRESS.replaceAll(', ', '\n')

let qr: string | undefined
const data = {
  name: props.accountData.ACCOUNT_HOLDER,
  iban: props.accountData.IBAN,
  amount,
  unstructuredReference: props.reference,
}
try {
  qr = generateQrCode(data)
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn('Invalid QR code data.\n', error)
  qr = undefined
}
</script>

<style scoped>
.qr-code {
  border-radius: 20px;
}

.account-data-table {
  background: transparent;
}
</style>
