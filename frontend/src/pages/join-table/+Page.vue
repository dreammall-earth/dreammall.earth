<template>
  <div class="background">
    <form class="panel">
      <div v-if="isError" class="d-flex flex-column align-center justify-space-around pa-4">
        <h2 class="section-headline">{{ t('joinTablePage.unknownTable') }}</h2>

        <div class="reminder text-center mt-8 pa-5 font-weight-medium">
          <LogoImage class="mx-auto" size="tiny" :text-enabled="false" />
          <p class="mt-5">
            {{ $t('joinTablePage.unknownTableErrorText') }}
          </p>
        </div>
      </div>

      <div v-else class="d-flex flex-column align-center justify-space-around pa-4">
        <h2 class="section-headline">{{ title }}</h2>

        <div class="reminder text-center mt-8 pa-5 font-weight-medium">
          <LogoImage class="mx-auto" size="tiny" :text-enabled="false" />
          <p class="mt-5">
            {{ $t('joinTablePage.reminder') }}
          </p>
        </div>

        <v-text-field
          v-model="userName"
          flat
          rounded
          class="elevation-0 w-75 flex-grow-0 mt-12"
          content-class="elevation-0"
          :label="t('joinTablePage.guestName')"
          variant="solo-filled"
          append-inner-icon="mdi-pencil"
          maxlength="64"
          required
          autofocus
        />
        <!-- todo: manage values as maxlength globally? -->

        <SimpleButton class="mt-12 mx-auto" :label="t('joinTablePage.submit')" @click="submit" />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import { usePageContext } from '#context/usePageContext'
import useGetTableName from '#pages/join-table/useGetTableName'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { joinTableAsGuestQuery } from '#queries/joinTableAsGuestQuery'

const { t } = useI18n()

const pageContext = usePageContext()
const tableId = Number(pageContext.routeParams?.id)

const { tableName, isError } = useGetTableName(tableId)
const title = computed<string>(() => tableName.value ?? t('joinTablePage.publicTable'))

const userName = ref('')

const { result: joinTableAsGuestQueryResult, refetch: joinTableAsGuestQueryRefetch } = useQuery(
  joinTableAsGuestQuery,
  {
    userName: userName.value,
    tableId,
  },
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

const submit = async () => {
  try {
    await joinTableAsGuestQueryRefetch({
      userName: userName.value,
      tableId,
    })
    if (joinTableAsGuestQueryResult.value) {
      window.location.href = joinTableAsGuestQueryResult.value.joinTableAsGuest
    }
  } catch (error) {
    GlobalErrorHandler.error('table link not found', error)
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.panel {
  width: min(636px, 100vw);
  padding: 20px 20px 40px;
  background-color: var(--v-dm-panel-background-color);
  backdrop-filter: blur(30px);
  border: 1px solid var(--v-dm-panel-border-color);
  border-radius: 30px;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));

  @media #{map.get($display-breakpoints, 'sm-and-down')} {
    padding: 10px 10px 20px;
    margin-right: 20px;
    margin-left: 20px;
    width: calc(100% - 40px);
    transform: translate(0, calc(50vh - 50%));
  }
}

.reminder {
  color: rgb(var(--v-theme-dm-panel-reminder-text-color));
  background-color: var(--v-dm-panel-reminder-text-background-color);
  border-radius: 24px;
}

.v-text-field {
  @media #{map.get($display-breakpoints, 'sm-and-down')} {
    width: 100% !important;
  }
}

.background {
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/join-table-background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
