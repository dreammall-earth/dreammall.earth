<template>
  <CockpitCard narrow>
    <template #header>
      <div class="header">
        <button class="back" @click="$emit('back')"><v-icon icon="$back"></v-icon></button>
        <h2>{{ $t('cockpit.about-me.edit.title') }}</h2>
      </div>
    </template>
    <template #default>
      <v-form class="add-social" @submit.prevent="addSocial">
        <v-select
          v-model="newSocial.type"
          flat
          rounded
          :items="socialMediaTypes"
          class="select-category"
        >
          <template #selection="{ item }">
            <v-icon :icon="getSocialMediaIcon(item.value)"></v-icon>
          </template>
          <template #item="{ item, props: listProps }">
            <v-list-item v-bind="listProps" title="">
              <v-icon :icon="getSocialMediaIcon(item.value)"></v-icon>
            </v-list-item>
          </template>
        </v-select>
        <v-text-field
          v-model="newSocial.link"
          name="text"
          clearable
          rounded
          flat
          density="compact"
          variant="solo"
          class="add-social-text"
          maxlength="60"
        ></v-text-field>
        <v-btn type="submit" :disabled="newSocial.link?.length === 0" variant="flat" rounded>
          <v-icon icon="mdi mdi-plus"></v-icon>
        </v-btn>
      </v-form>
      <ul class="social-media-list">
        <li v-for="(social, index) in props.socials" :key="index">
          <v-chip class="social">
            <v-icon :icon="getSocialMediaIcon(social.type)" class="mr-2" />
            {{ buildSocialMediaLink(social.type, social.link) }}
            <v-icon
              v-if="social.id >= 0"
              icon="$close"
              @click="$emit('remove-social', social.id)"
            />
          </v-chip>
        </li>
      </ul>
    </template>
  </CockpitCard>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

import CockpitCard from '#components/cockpit/cockpitCard/CockpitCard.vue'

import { getSocialMediaIcon, socialMediaTypes, buildSocialMediaLink } from './socialMediaPlatforms'

import type { SocialMedia, AddSocialMediaInput } from '#stores/userStore'

const props = defineProps<{
  socials: SocialMedia[]
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'add-social', social: AddSocialMediaInput): void
  (e: 'remove-social', id: number): void
}>()

const newSocial = reactive<AddSocialMediaInput>({
  type: 'instagram',
  link: '',
})

const addSocial = () => {
  emit('add-social', newSocial)
}
</script>

<style scoped>
.back {
  width: 40px;
}

.header {
  display: flex;
  gap: 20px;
}

.add-social {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  &:deep(.v-input__socials) {
    display: none;
  }
}

.select-category {
  max-width: 80px;

  &:deep(.v-field__outline) {
    display: none;
  }
}

.add-social-text {
  &:deep(.v-field) {
    background: grey; /* TODO set correct color */
  }
}
</style>
