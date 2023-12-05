<template>
  <div>
    <v-text-field
      :label="props.inputLabel"
      class="custom-font"
      bg-color="#D9D9D9"
      base-color="#3D4753"
      color="#3D4753"
      rounded
      variant="solo"
      type="input"
    >
      <template #append-inner>
        <MainButton class="my-2" variant="primary" :label="props.buttonLabel" @click="onClick">
          {{ props.buttonLabel }}
        </MainButton>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
import MainButton from './MainButton.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the input
     */
    inputLabel: string
    /**
     * The label of the button
     */
    buttonLabel: string
  }>(),
  { inputLabel: 'Input', buttonLabel: 'Button' },
)

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const onClick = () => {
  emit('click', 1)
}
</script>

<style lang="scss">
.custom-font .v-field__field {
  font-family: Poppins, sans-serif;
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.7rem;
  color: #3d4753 !important;
}
</style>
