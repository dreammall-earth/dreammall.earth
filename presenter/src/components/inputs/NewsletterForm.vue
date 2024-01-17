<template>
  <v-sheet color="transparent">
    <v-form ref="form" class="newsletter-form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="6">
          <NameInput
            v-model="firstname"
            name="firstname"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.firstname')"
            required
          ></NameInput>
        </v-col>
        <v-col cols="12" sm="6">
          <NameInput
            v-model="lastname"
            name="lastname"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.lastname')"
            required
          ></NameInput>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <EmailInput
            v-model="email"
            name="email"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.email')"
            required
          ></EmailInput>
        </v-col>
        <v-col cols="12" sm="6 d-flex align-center">
          <MainButton
            class="w-100"
            variant="submit"
            size="auto"
            :label="$t('home.newsletterSection.newsletterForm.submitBtn')"
            type="submit"
            :is-loading="formIsLoading"
          >
          </MainButton>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex align-start">
          <DataPrivacyCheckbox></DataPrivacyCheckbox>
          <span class="ml-4 pt-2 newsletter-agb"
            >{{ $t('home.newsletterSection.newsletterForm.privacy') }}
            <AnchorLink
              class=""
              href="/datenschutz"
              variant="text"
              :label="$t('home.newsletterSection.newsletterForm.privacyLinkLabel')"
            ></AnchorLink
          ></span>
        </v-col>
      </v-row>
      <v-row class="mt-0" align-content="center">
        <v-col class="pt-0">
          <TransitionGroup>
            <span v-if="showFormSuccess" class="info-text form-success">{{
              $t('home.newsletterSection.newsletterForm.successMsg')
            }}</span>
            <span v-if="showFormError" class="info-text form-error">{{
              $t('home.newsletterSection.newsletterForm.errorMsg')
            }}</span>
          </TransitionGroup>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'

import DataPrivacyCheckbox from '#components/controls/DataPrivacyCheckbox.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'
import { subscribeToNewsletterMutation } from '#mutations/subscribeToNewsletterMutation'

import EmailInput from './EmailInput.vue'
import MainButton from './MainButton.vue'
import NameInput from './NameInput.vue'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const formIsLoading = ref(false)
const showFormError = ref(false)
const showFormSuccess = ref(false)

const showInfoTime: number = 5000

const form = ref<HTMLFormElement>()

const { mutate: sendSubscribeToNewsletter } = useMutation(subscribeToNewsletterMutation)

// submit form with data
async function submitForm() {
  const isValid = await form.value?.validate()
  if (isValid?.valid) {
    formIsLoading.value = !formIsLoading.value
    try {
      await sendSubscribeToNewsletter({
        data: {
          email: email.value,
          firstName: firstname.value,
          lastName: lastname.value,
        },
      })

      showFormSuccess.value = !showFormSuccess.value
      await form.value?.reset()
      formIsLoading.value = !formIsLoading.value

      setTimeout(() => {
        showFormSuccess.value = !showFormSuccess.value
      }, showInfoTime)
    } catch {
      showFormError.value = !showFormError.value
      formIsLoading.value = !formIsLoading.value

      setTimeout(() => {
        showFormError.value = !showFormError.value
      }, showInfoTime)
    }
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

  .info-text {
    font-family: Poppins, sans-serif;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    &.form-success {
      color: green;
    }

    &.form-error {
      color: rgb(176 0 32);
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
