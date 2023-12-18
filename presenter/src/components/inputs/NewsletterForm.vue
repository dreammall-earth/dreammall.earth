<template>
  <v-sheet color="transparent">
    <v-form ref="form" class="newsletter-form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="firstname"
            name="firstname"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.firstname')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            required
            :rules="[
              () => !!firstname || $t('home.newsletterSection.newsletterForm.fieldRequired'),
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="email"
            name="email"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.email')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            type="email"
            required
            :rules="[() => !!email || $t('home.newsletterSection.newsletterForm.fieldRequired')]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <MainButton
            class="w-100"
            variant="submit"
            size="auto"
            :label="$t('home.newsletterSection.newsletterForm.submitBtn')"
            type="submit"
          >
          </MainButton>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="8" class="d-flex align-start">
          <v-checkbox
            v-model="dataprivacy"
            name="dataprivacy"
            color="rgba(174, 179, 189, 0.50)"
            value="false"
            hide-details="auto"
            :center-affix="false"
            density="compact"
            required
            :rules="[
              () => !!dataprivacy || $t('home.newsletterSection.newsletterForm.fieldRequired'),
            ]"
          >
          </v-checkbox>
          <span class="ml-4 pt-2 newsletter-agb"
            >{{ $t('home.newsletterSection.newsletterForm.privacy') }}
            <AnchorLink
              class=""
              href="#"
              variant="text"
              :label="$t('home.newsletterSection.newsletterForm.privacyLinkLabel')"
            ></AnchorLink
          ></span>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'

import AnchorLink from '#components/nav/AnchorLink.vue'
import { subscribeToNewsletterMutation } from '#mutations/subscribeToNewsletterMutation'

import MainButton from './MainButton.vue'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const dataprivacy = ref(0)

const form = ref<HTMLFormElement>()

const { mutate: sendSubscribeToNewsletter } = useMutation(subscribeToNewsletterMutation)

// submit form with data
async function submitForm() {
  const isValid = await form.value?.validate()
  if (isValid?.valid) {
    try {
      await sendSubscribeToNewsletter({
        data: {
          email: email.value,
          firstName: firstname.value,
          lastName: lastname.value,
        },
      })
      await form.value?.reset()
    } catch {}
  }
}
</script>

<style scoped lang="scss">
.newsletter-form {
  .newsletter-text {
    border: 1px solid #fff;
    border-radius: 15px;

    .v-field {
      border: 1px solid #fff;
      border-radius: 15px;

      .v-field__field {
        label.v-label {
          color: #3d4753;
        }
      }
    }
  }

  .newsletter-agb {
    font-family: Poppins, sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    color: #3d4753;

    .agb-link {
      padding-bottom: 2px;
    }
  }
}
</style>
