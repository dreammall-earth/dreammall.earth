<template>
  <v-card class="mb-2 w-100" width="375" flat color="transparent">
    <v-img height="100" :src="props.imageSrc" class="text-white"></v-img>
    <v-card-title class="card-title mt-8">{{ props.cardTitle }}</v-card-title>
    <v-card-text class="card-text mt-8">{{ props.cardText }}</v-card-text>
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
$mobile: 500px;

.v-card {
  max-width: 375px;
  font-family: Poppins, sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  color: #383838;
  text-align: center;

  .card-title {
    font-size: 1.625rem;
    font-weight: 600;
    line-height: 125%; /* 2.03125rem */
    text-overflow: unset;
    text-transform: capitalize;
    text-wrap: balance;
  }
}
</style>
