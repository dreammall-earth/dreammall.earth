<template>
  <div class="step-header" :class="{ 'dream-mall-button-mode': props.isDreamMallButtonMode }">
    <div class="step-header__left">
      <v-btn v-if="isBackButtonVisible" icon variant="text" size="small" @click="emitBack">
        <v-icon class="back" icon="mdi-chevron-left" />
      </v-btn>
    </div>
    <div class="step-header__middle">
      <h2 class="text-h6 font-weight-bold">{{ title }}</h2>
    </div>
    <div class="step-header__right">
      <v-btn v-if="isCloseButtonVisible" icon variant="text" size="small" @click="emitClose">
        <v-icon icon="mdi-close" />
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    isBackButtonVisible: boolean
    isCloseButtonVisible: boolean
    isDreamMallButtonMode: boolean
  }>(),
  {
    title: '',
    isBackButtonVisible: true,
    isCloseButtonVisible: true,
    isDreamMallButtonMode: false,
  },
)

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
}>()

const emitBack = () => emit('back')
const emitClose = () => emit('close')
</script>

<style scoped lang="scss">
.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;

  &__left,
  &__right {
    display: flex;
    place-content: flex-start flex-start;
    align-items: flex-start;
    width: 48px; // Ensures consistent spacing even when buttons are hidden
    height: 100%;
  }

  &__right {
    justify-content: flex-end;
  }

  &__middle {
    flex-grow: 1;
    text-align: center;
  }

  &.dream-mall-button-mode &__middle {
    padding-top: 20px;
    padding-bottom: 10px;
  }

  .back::before {
    // Scales up the chevron icon to have an optically (not pixel!) equivalent size to the close button
    font-size: 21px !important;
  }
}
</style>
