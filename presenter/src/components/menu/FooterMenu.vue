<template>
  <div>
    <v-footer color="#f5f5f5" dark class="justify-center">
      <v-row justify="center" class="my-4 justify-space-around footer">
        <v-col cols="6" md="3" class="d-flex flex-column align-start">
          <h2 class="footer-header mb-3 text-left">{{ $t('menu.footer.sitemap') }}</h2>
          <div class="footer-links">
            <AnchorLink class="min-helper" href="/" :label="$t('menu.footer.home')"></AnchorLink>
            <AnchorLink href="/#planning-section" :label="$t('menu.footer.planing')"></AnchorLink>
            <AnchorLink
              href="/#coffee-section"
              :label="$t('menu.footer.worldCoffeeHouse')"
            ></AnchorLink>
            <!-- <AnchorLink href="/" :label="$t('menu.footer.humansAndProjects')"></AnchorLink> -->
            <!-- <h3 class="footer-header mt-4 mb-1 text-left">
              {{ $t('menu.footer.socialHeadline') }}
            </h3>
            <AnchorLink href="/" :label="$t('menu.footer.instagram')"></AnchorLink>
            <AnchorLink href="/" :label="$t('menu.footer.telegram')"></AnchorLink> -->
          </div>
        </v-col>

        <v-col cols="6" md="3">
          <h2 class="footer-header mb-3 text-left">{{ $t('menu.footer.privacyHeadline') }}</h2>
          <div class="footer-links">
            <AnchorLink href="/impressum" :label="$t('menu.footer.impress')"></AnchorLink>
            <!-- <AnchorLink href="/" :label="$t('menu.footer.cookies')"></AnchorLink> -->
            <AnchorLink
              href="/#newsletter-section"
              :label="$t('menu.footer.newsletter')"
            ></AnchorLink>
            <AnchorLink href="/datenschutz" :label="$t('menu.footer.privacy')"></AnchorLink>
          </div>
          <LogoImage class="mt-8" size="small" />
        </v-col>

        <v-col cols="12" md="6">
          <h2 class="footer-header mb-5 text-left">{{ $t('menu.footer.contact') }}</h2>
          <div>
            <ContactForm />
          </div>
        </v-col>
      </v-row>
    </v-footer>
    <div class="gradient-bg"></div>
  </div>
</template>

<script lang="ts" setup>
import ContactForm from '#components/inputs/ContactForm.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'

import LogoImage from './LogoImage.vue'
</script>

<style scoped lang="scss">
$mobile: 500px;

.gradient-bg {
  width: 100%;
  height: 10px;
  background: linear-gradient(98.77deg, #3095d4 0%, rgb(249 196 81 / 55%) 99.16%);
}

.footer {
  max-width: 1200px;
}

.footer-header {
  font-family: Poppins, sans-serif;
  font-size: 1.623rem;
  font-weight: 600;
  line-height: 2rem;
  color: #3d4753;

  @media screen and (max-width: $mobile) {
    font-size: 140%;
  }
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;

  a {
    @media screen and (max-width: $mobile) {
      font-size: 100%;
    }
  }

  .min-helper {
    min-width: auto;
  }
}

.min-width-remover {
  min-width: 0;
}
</style>
