<template>
  <div class="h-screen">
    <div class="section1 h-screen pt-4">
      <p class="section-headline mt-16">{{ $t('home.section1.headline') }}</p>
      <div class="w-100 mt-16 d-flex justify-center">
        <LogoImage size="large" />
      </div>
      <p class="section-subheadline mt-16">
        {{ $t('home.section1.subHeadline') }}
      </p>
      <MainButton
        class="mt-8"
        :label="$t('home.section1.preOrderBtn')"
        size="large"
        variant="primary"
        >{{ $t('home.section1.preOrderBtn') }}</MainButton
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import MainButton from '#components/inputs/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
</script>

<style scoped lang="scss">
.section1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background: linear-gradient(0deg, #f5f5f5 0.06%, #d8d8d8 100%);

  .section-headline {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-weight: 300;
    line-height: 1.875;
    color: #3d4753;
  }

  .section-subheadline {
    font-family: Poppins, sans-serif;
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.6875;
    color: #797979;
  }
}
</style>
