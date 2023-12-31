<template>
  <v-sheet color="transparent">
    <v-form ref="form" class="newsletter-form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="6">
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
            :rules="nameRules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="lastname"
            name="lastname"
            class="newsletter-text"
            :label="$t('home.newsletterSection.newsletterForm.lastname')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            required
            :rules="nameRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
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
            :rules="emailRules"
          ></v-text-field>
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
          <v-checkbox
            v-model="dataprivacy"
            name="dataprivacy"
            color="rgba(174, 179, 189, 0.50)"
            value="false"
            hide-details="auto"
            :center-affix="false"
            density="compact"
            required
            :rules="[() => !!dataprivacy || $t('validation.fieldRequired')]"
          >
          </v-checkbox>
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

import AnchorLink from '#components/nav/AnchorLink.vue'
import { subscribeToNewsletterMutation } from '#mutations/subscribeToNewsletterMutation'
import { nameRules, emailRules } from '#src/validation/validation'

import MainButton from './MainButton.vue'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const dataprivacy = ref(0)
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
