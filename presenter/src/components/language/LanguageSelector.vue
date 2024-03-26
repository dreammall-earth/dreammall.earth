<template>
  <v-select
    v-model="selectedLocale"
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
    @update:model-value="updateLanguage"
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

import { usePageContext } from '#context/usePageContext'
import i18n from '#plugins/i18n'
import { LocaleCode, locales, localizedLocale } from '#src/locales'

const pageContext = usePageContext()
const languages = ref(localizedLocale)

const selectedLocale = ref(i18n.global.locale.value)

const updateLanguage = () => {
  if (locales.includes(selectedLocale.value)) {
    i18n.global.locale.value = selectedLocale.value
  }

  let { urlOriginal } = pageContext
  const urlPaths = urlOriginal.split('/')

  let urlWithoutLocale = ''
  let leadingSlash = '/'
  if (urlPaths[1].indexOf('#') > -1) {
    const hashUrl = urlPaths[1].split('#')
    urlWithoutLocale = '#' + hashUrl[1]
    leadingSlash = ''
  } else if (!locales.includes(urlPaths[1] as LocaleCode)) {
    urlWithoutLocale = leadingSlash + urlPaths[1]
  }

  if (locales.includes(selectedLocale.value)) {
    urlWithoutLocale += leadingSlash + urlPaths.slice(2).join('/')
    urlOriginal = '/' + selectedLocale.value + urlWithoutLocale
  }
  window.location.href = urlOriginal
}
</script>

<style lang="scss">
@import '#root/src/assets/scss/style';

.language-select {
  max-width: 80px;

  @include section-content-font;

  @media screen and (max-width: $mobile) {
    transform: translateX(40px);
  }
}

.language-select.v-select.v-select--active-menu {
  color: $color-blue-300;
}

.v-select__content {
  .v-list {
    padding: 0;

    .language-item {
      min-width: 4.875rem;
      padding-inline: 24px !important;
      padding-left: 6px !important;

      .language-item-title {
        font-family: $font-family-default;
        font-size: 1rem;
        font-style: $font-style-normal;
        font-weight: 500;
        line-height: $line-height-normal;
      }

      &::before {
        display: inline-block;
        width: 2px;
        height: 25px;
        margin-right: 20px;
        content: '';
        background: transparent;
      }
    }

    .language-item-active {
      color: $color-green-100 !important;
    }

    .language-item-active::before {
      display: inline-block;
      width: 2px;
      height: 25px;
      margin-right: 20px;
      content: '';
      background: $color-green-100;
    }
  }
}
</style>
