<template>
  <v-select
    v-model="$i18n.locale"
    density="compact"
    name="language"
    :items="languages"
    item-value="locale"
    class="language-select"
    variant="solo"
    base-color="#3D4753"
    color="#3D4753"
    bg-color="transparent"
    hide-details="auto"
    flat
  >
    <template #selection="{ item }">
      <span>{{ item.raw.locale.toUpperCase() }}</span>
    </template>
    <template #item="{ props }">
      <v-list-item v-bind="props" class="language-item" active-class="language-item-active">
        <template #title="{ title }">
          <div class="language-item-title">{{ title }}</div>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// TODO better place? maybe locales folder?
const languages = ref([
  { locale: 'de', title: 'Deutsch' },
  { locale: 'en', title: 'Englisch' },
])
</script>

<style lang="scss">
@import '#root/src/assets/scss/style';

.topmenu {
  .v-select {
    @include section-content-font;
  }

  .language-select {
    @media screen and (max-width: $mobile) {
      transform: translateX(40px);
    }
  }

  .v-select.v-select--active-menu {
    color: $color-blue-300;
  }
}
.v-select__content {
  .v-list {
    padding: 0px;

    .language-item {
      padding-inline: 24px !important;
      padding-left: 6px !important;
      min-width: 4.875rem;

      .language-item-title {
        font-family: Poppins;
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      &:before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 25px;
        background: transparent;
        margin-right: 20px;
      }
    }

    .language-item-active {
      color: $color-green-100 !important;
    }
    .language-item-active:before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 25px;
      background: $color-green-100;
      margin-right: 20px;
    }
  }
}
</style>
