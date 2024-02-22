<template>
  <div class="data-protection-section my-16 v-container">
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
            <h2 class="card-header">{{ $t('dataProtection.processing.headline') }}</h2>
            <p class="card-content my-4">{{ $t('dataProtection.processing.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('dataProtection.revocation.headline') }}</h2>
            <p class="card-content mt-2">{{ $t('dataProtection.revocation.content') }}</p>
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
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.data-protection-section {
  max-width: 1120px;
  font-family: $font-family-default;
  color: $font-color-dark;
  background: $background-color-primary;

  .section-header {
    text-align: center;

    h1.section-headline {
      @include text-font-headline;

      @media screen and (max-width: $tablet) {
        font-size: 2.5rem;
      }

      @media screen and (max-width: $mobile) {
        font-size: 2rem;
      }
    }
  }

  .content-card {
    @include page-content-card-mixin;
  }
}
</style>
