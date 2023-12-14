<template>
  <div class="data-protection-section pt-4 v-container">
    <v-row class="section-header">
      <v-col>
        <h1 class="section-headline">
          {{ $t('dataProtection.headline') }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12 h-100">
          <template #text>
            <h2 class="card-header">{{ $t('dataProtection.general.headline') }}</h2>
            <p class="card-content my-4">{{ $t('dataProtection.general.infoStart') }}</p>
            <ul class="card-content mt-2">
              <li>{{ $t('dataProtection.general.company') }}</li>
              <li>{{ $t('dataProtection.general.person') }}</li>
              <li>{{ $t('dataProtection.general.street') }}</li>
              <li>
                {{ $t('dataProtection.general.zip') }} {{ $t('dataProtection.general.city') }}
              </li>
            </ul>
            <p class="card-content my-4">{{ $t('dataProtection.general.infoEnd') }}</p>
          </template>
        </v-card>
      </v-col>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-10 h-100">
          <template #text>
            <h2 class="card-header">{{ $t('dataProtection.revocation.headline') }}</h2>
            <p class="card-content my-4">{{ $t('dataProtection.revocation.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('dataProtection.euDispute.headline') }}</h2>
            <p class="card-content mt-2">
              {{ $t('dataProtection.euDispute.content') }}
            </p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('dataProtection.consumerDispute.headline') }}</h2>
            <p class="card-content mt-2">
              {{ $t('dataProtection.consumerDispute.content') }}
            </p>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
$mobile: 500px;

.data-protection-section {
  max-width: 1120px;
  font-family: Poppins, sans-serif;
  color: #383838;
  background: #f5f5f5;

  .section-header {
    text-align: center;

    h1.section-headline {
      font-size: 3.875rem;
      font-style: normal;
      font-weight: 700;
      line-height: 120%;
      text-transform: capitalize;

      @media screen and (max-width: $mobile) {
        font-size: 2.5rem;
      }
    }
  }

  .content-card {
    font-size: 1.25rem;
    line-height: normal;
    background: #fff;
    border-radius: 1.875rem;

    @media screen and (max-width: $mobile) {
      font-size: 1rem;
    }

    .card-header {
      font-weight: 700;

      @media screen and (max-width: $mobile) {
        font-size: 1rem;
      }
    }

    .card-content {
      font-weight: 300;
      list-style: none;
    }
  }
}
</style>
