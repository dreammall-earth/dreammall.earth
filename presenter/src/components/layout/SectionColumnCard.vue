<template>
  <v-card class="mb-12 mb-md-2 w-100" width="375" flat color="transparent">
    <v-img height="100" :src="props.imageSrc" class="text-white"></v-img>
    <v-card-title class="card-title mt-0 mt-md-8">{{ props.cardTitle }}</v-card-title>
    <v-card-text class="card-text mt-0 mt-md-8">{{ props.cardText }}</v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /**
     * src of the header image
     */
    imageSrc?: string
    /**
     * card header
     */
    cardTitle?: string
    /**
     * card text content
     */
    cardText?: string
  }>(),
  {
    imageSrc: '',
    cardTitle: 'Title',
    cardText: 'Lorem ipsum text',
  },
)
</script>

<style scoped lang="scss">
@import '#root/src/assets/scss/style';

.v-card {
  @include text-font-base($font-color-card);

  max-width: $layout-column-card-max-width;
  text-align: center;

  .card-title {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 81px;
    font-size: $font-size-card;
    font-weight: $font-weight-large;
    hyphens: none;
    line-height: $line-height-x-larger; /* 2.03125rem */
    text-overflow: unset;
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */

    @media screen and (max-width: $tablet) {
      min-height: 61px;
    }
  }
}
</style>
