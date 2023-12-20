<template>
  <div class="topmenu">
    <v-app-bar :color="appBackground" flat>
      <v-row>
        <v-col class="d-flex align-center">
          <a href="/" class="w-100 ml-8">
            <LogoImage class="" />
          </a>
        </v-col>
        <v-col class="d-none d-md-flex align-center justify-center grow">
          <!-- TODO same as below: refactor -->
          <AnchorLink class="mx-4" href="/#about" :label="$t('menu.header.about')"></AnchorLink>
          <AnchorLink
            class="mx-4"
            href="/#products"
            :label="$t('menu.header.products')"
          ></AnchorLink>
          <AnchorLink
            class="mx-4"
            href="/#contactname"
            :label="$t('menu.header.contact')"
          ></AnchorLink>
        </v-col>
        <v-col class="d-flex">
          <div class="d-flex d-md-none align-center justify-end w-100 mr-8">
            <v-img
              class="mobile-menu-icon w-100"
              :src="MobileMenuIcon"
              @click="toggleNavBar"
            />
          </div>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer
      v-model="mobileMenu"
      :color="navBackground"
      location="right"
      class="nav-drawer d-flex d-md-none"
    >
      <div class="d-flex flex-column py-8">
        <!-- TODO same as above: refactor -->
        <AnchorLink
          class="ma-4"
          href="/#about"
          :label="$t('menu.header.about')"
          @click="mobileMenu = !mobileMenu"
        ></AnchorLink>
        <AnchorLink
          class="ma-4"
          href="/#products"
          :label="$t('menu.header.products')"
          @click="mobileMenu = !mobileMenu"
        ></AnchorLink>
        <AnchorLink
          class="ma-4"
          href="/#contactname"
          :label="$t('menu.header.contact')"
          @click="mobileMenu = !mobileMenu"
        ></AnchorLink>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'
import MobileMenuIcon from '#assets/img/hamburger_mobile.svg'

const appBackground = ref('transparent')
const navBackground = ref('#d8d8d8')
const mobileMenu = ref(false)

function changeAppBarBackground() {
  if (appBackground.value !== '#f5f5f5') {
    // TODO change class for smoother transition
    appBackground.value = '#f5f5f5'
    navBackground.value = '#f5f5f5'
  }
}

function toggleNavBar() {
  mobileMenu.value = !mobileMenu.value

  if (navBackground.value !== '#f5f5f5') {
    // TODO change class for smoother transition
    navBackground.value = '#f5f5f5'
    appBackground.value = '#f5f5f5'
  }
}

onMounted(() => {
  window.addEventListener('scroll', changeAppBarBackground)
})
onUnmounted(() => {
  window.removeEventListener('scroll', changeAppBarBackground)
})
</script>

<style scoped lang="scss">
.topmenu {
  background: linear-gradient(0deg, #f5f5f5 0.06%, #d8d8d8 100%);
}
</style>

<style lang="scss">
.topmenu {
  .v-toolbar__content {
    height: 95px !important;
  }
  .mobile-menu-icon {
    max-width: 35px;

    &:hover {
      cursor: pointer;
    }
  }
  .nav-drawer {
    top: 95px !important;
    height: fit-content !important;
  }
}
</style>
