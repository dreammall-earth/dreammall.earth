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
        <v-col class="d-flex justify-end">
          <div class="d-flex align-center mr-0 mr-md-8 language-column">
            <LanguageSelector />
          </div>
          <div v-if="showAuthentication" class="d-flex align-center mr-0 mr-md-8">
            <div v-if="auth.isLoggedIn">
              <!--<MainButton
                variant="third-inverse"
                class="mr-1"
                label="Query"
                size="small"
                @click="queryProtectedBackend"
              />-->
              <MainButton
                class="sign-out"
                variant="third"
                label="Sign Out"
                size="small"
                @click="signOut"
              />
            </div>
            <div v-else>
              <MainButton
                variant="third-inverse"
                class="mr-1 sign-in"
                label="Sign in"
                size="small"
                @click="signIn"
              />
              <MainButton
                class="sign-up"
                variant="third"
                label="Sign up"
                size="small"
                @click="signUp"
              />
            </div>
          </div>
          <div class="d-flex d-md-none align-center justify-end mr-8 mobile-column">
            <v-img class="mobile-menu-icon w-100" :src="MobileMenuIcon" @click="toggleNavBar" />
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
// import { DefaultApolloClient, useQuery } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { ref, onMounted, onBeforeMount, inject } from 'vue'

import MobileMenuIcon from '#assets/img/hamburger_mobile.svg'
import MainButton from '#components/buttons/MainButton.vue'
import LanguageSelector from '#components/language/LanguageSelector.vue'
import LogoImage from '#components/LogoImage.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'
// import { querySecret } from '#queries/querySecret'
import { AUTH } from '#src/env'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'
// import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const authService = inject<AuthService>('authService')
const auth = useAuthStore()
const showAuthentication = AUTH.AUTHORITY && AUTH.AUTHORITY_SIGNUP_URI

// TODO what about the store?
async function signIn() {
  try {
    await authService?.signIn()
    navigate('/')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}

function signUp() {
  window.location.href = AUTH.AUTHORITY_SIGNUP_URI
}

async function signOut() {
  try {
    await authService?.signOut()
    auth.clear()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}

/*
    const apolloClient = inject<ApolloClient<InMemoryCache>>(DefaultApolloClient)

    async function queryProtectedBackend() {
    try {
    const secret = await apolloClient?.query({ query: querySecret })
    // eslint-disable-next-line no-console
    console.log(secret)
    } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error secret', error)
    }
    }
  */

const appBackground = ref('transparent')
const navBackground = ref('#d8d8d8')
const mobileMenu = ref(false)

let videoSlideObserver: IntersectionObserver

function changeAppBarBackground() {
  if (appBackground.value !== '#f5f5f5') {
    appBackground.value = '#f5f5f5'
    navBackground.value = '#f5f5f5'
  }
}

function resetAppBarBackground() {
  if (appBackground.value !== 'transparent') {
    appBackground.value = 'transparent'
    navBackground.value = 'transparent'
  }
}

function toggleNavBar() {
  mobileMenu.value = !mobileMenu.value

  if (navBackground.value !== '#f5f5f5') {
    navBackground.value = '#f5f5f5'
    appBackground.value = '#f5f5f5'
  }
}

onBeforeMount(() => {
  videoSlideObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        resetAppBarBackground()
      } else {
        changeAppBarBackground()
      }
    },
    {
      threshold: 0.1,
    },
  )
})

onMounted(() => {
  const videoSlide = document.querySelector('#intro-video-slide')
  if (videoSlide && videoSlideObserver) {
    videoSlideObserver.observe(videoSlide)
  } else {
    // fallback to show navbar on other pages
    changeAppBarBackground()
  }
})
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.topmenu {
  background: linear-gradient(
    0deg,
    $background-color-primary 0.06%,
    $background-color-primary-transition 100%
  );
}
</style>

<style lang="scss">
@import '#root/src/assets/scss/style';

.topmenu {
  .v-toolbar {
    transition: background-color 0.3s;

    .v-toolbar__content {
      height: $fixed-header-height !important;
    }

    .mobile-menu-icon {
      max-width: $mobile-menu-icon-max-width;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .language-column {
    @media screen and (max-width: $tablet) {
      width: 100%;
      max-width: 80px;
    }
  }

  .mobile-column {
    @media screen and (max-width: $tablet) {
      width: 100%;
      max-width: 80px;
    }
  }

  .nav-drawer {
    top: $fixed-header-height !important;
  }
}
</style>
