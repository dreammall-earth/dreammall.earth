<template>
  <div class="h-screen">
    <div class="section1 h-screen pt-4">
      <p class="headline mt-16">{{ $t('home.section1.headline') }}</p>
      <div class="w-100 mt-16 d-flex justify-center ">
        <LogoImage size="large" />
      </div>
      <p class="subheadline mt-16">
        {{ $t('home.section1.subHeadline') }}
      </p>
      <MainButton class="mt-8" :label="$t('home.section1.preOrderBtn')" size="large" variant="primary">{{
        $t('home.section1.preOrderBtn')
      }}</MainButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import LogoImage from '#components/menu/LogoImage.vue'
import MainButton from '#components/inputs/MainButton.vue'
</script>

<style scoped lang="scss">
.section1 {
  display: flex;
  flex-direction: column;
  align-items: center;  
  background: linear-gradient(0deg, #F5F5F5 0.06%, #D8D8D8 100%);


  .headline{
    font-size: 1.25rem;
    font-family: "Poppins";
    font-weight: 300;
    line-height: 1.875;
    color: #3D4753;
  }
  .subheadline{
    font-size: 1.125rem;
    font-family: "Poppins";
    font-weight: 400;
    line-height: 1.6875;
    color: #797979;
  }
}
.section-bg {
}
</style>