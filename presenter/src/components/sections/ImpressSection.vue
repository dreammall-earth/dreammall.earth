<template>
  <div class="impress-section my-16 v-container">
    <v-row class="section-header">
      <v-col>
        <h1 class="section-headline">
          {{ $t('impress.headline') }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('impress.data.headline') }}</h2>
            <ul class="card-content mt-2 my-8">
              <li>{{ $t('impress.data.name') }}</li>
              <li>{{ $t('impress.data.street') }}</li>
              <!--<li>{{ $t('impress.data.additional') }}</li>-->
              <li>{{ $t('impress.data.zip') }} {{ $t('impress.data.city') }}</li>
            </ul>
            <!--<ul class="card-content my-8">
              <li>{{ $t('impress.data.registerLabel') }} {{ $t('impress.data.register') }}</li>
              <li>{{ $t('impress.data.courtLabel') }} {{ $t('impress.data.court') }}</li>
            </ul>-->

            <h2 class="card-header">{{ $t('impress.data.personHeadline') }}</h2>
            <ul class="card-content mt-2">
              <li>{{ $t('impress.data.person1') }}</li>
              <li>{{ $t('impress.data.person2') }}</li>
            </ul>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card flat class="content-card mb-2 pa-4 pa-md-9">
          <template #text>
            <h2 class="card-header">{{ $t('impress.contact.headline') }}</h2>
            <ul class="card-content mt-2 my-8">
              <!--<li>
                {{ $t('impress.contact.telephoneLabel') }} {{ $t('impress.contact.telephone') }}
              </li>
              <li>{{ $t('impress.contact.telefaxLabel') }} {{ $t('impress.contact.telefax') }}</li>-->
              <li>{{ $t('impress.contact.emailLabel') }} {{ $t('impress.contact.email') }}</li>
            </ul>

            <h2 class="card-header">{{ $t('impress.contact.lawHeadline') }}</h2>
            <p class="mt-2 my-14">{{ $t('impress.contact.additionalLaw') }}</p>
          </template>
        </v-card>

        <!--<v-card flat class="content-card mb-2 pa-4 pa-md-8">
          <template #text>
            <h2 class="card-header">{{ $t('impress.tax.headline') }}</h2>
            <p class="card-content mt-2">
              {{ $t('impress.tax.content') }}<br />{{ $t('impress.tax.id') }}
            </p>
          </template>
        </v-card>-->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('impress.liabilityContent.headline') }}</h2>
            <p class="card-content mt-2">{{ $t('impress.liabilityContent.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('impress.liabilityLinks.headline') }}</h2>
            <p class="card-content mt-2">{{ $t('impress.liabilityLinks.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('impress.copyright.headline') }}</h2>
            <p class="card-content mt-2">{{ $t('impress.copyright.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat class="content-card mb-2 pa-4 pa-md-12">
          <template #text>
            <h2 class="card-header">{{ $t('impress.legalDisclaimer.headline') }}</h2>
            <p class="card-content mt-2">{{ $t('impress.legalDisclaimer.content') }}</p>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
$mobile: 500px;

.impress-section {
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
