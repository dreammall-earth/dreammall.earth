<template>
  <v-sheet color="transparent">
    <v-form ref="form" class="contact-form" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" md="6" class="py-0 pt-1">
          <NameInput
            id="contactname"
            v-model="firstname"
            name="firstname"
            class="contact-text"
            :label="$t('menu.footer.contactForm.firstName')"
            required
          ></NameInput>
        </v-col>
        <v-col cols="12" md="6" class="py-0 pt-1">
          <NameInput
            v-model="lastname"
            name="lastname"
            class="contact-text"
            :label="$t('menu.footer.contactForm.lastName')"
            required
          ></NameInput>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" md="6" class="py-0 pt-1">
          <EmailInput
            v-model="email"
            name="email"
            class="contact-text mt-4"
            :label="$t('menu.footer.contactForm.mail')"
            required
          ></EmailInput>
        </v-col>
        <v-col cols="12" md="6" class="py-0 pt-2 pa-md-3">
          <!-- <v-select
               v-model="topic"
               name="topic"
               :items="topicItems"
               :rules="[() => !!topic || $t('menu.footer.contactForm.fieldRequired')]"
               required
               class="contact-text mt-4"
               :label="$t('menu.footer.contactForm.topic')"
               variant="solo"
               color="#3D4753"
               bg-color="rgba(174, 179, 189, 0.50)"
               hide-details="auto"
               flat
               rounded="xl"
               menu-icon="mdi-arrow-down"
               ></v-select> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-2 pb-0">
          <v-textarea
            v-model="message"
            name="message"
            class="contact-message"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            :label="$t('menu.footer.contactForm.message')"
            flat
            variant="solo"
            rounded="xl"
            required
            :rules="messageRules"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col class="d-flex align-start">
          <DataPrivacyCheckbox />
          <span class="ml-6 ml-sm-4 pt-2 contact-dataprivacy"
            >{{ $t('menu.footer.contactForm.privacy') }}
            <AnchorLink
              class="dataprivacy-link"
              href="/datenschutz"
              variant="text"
              :label="$t('menu.footer.contactForm.privacyLinkLabel')"
            ></AnchorLink
          ></span>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <MainButton
            class="my-2 w-100"
            variant="submit"
            size="auto"
            :label="$t('menu.footer.contactForm.submitBtn')"
            type="submit"
            :is-loading="formIsLoading"
          >
          </MainButton>
        </v-col>
        <v-col>
          <TransitionGroup>
            <span v-if="showFormSuccess" class="info-text form-success">{{
              $t('menu.footer.contactForm.successMsg')
            }}</span>
            <span v-if="showFormError" class="info-text form-error">{{
              $t('menu.footer.contactForm.errorMsg')
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

import MainButton from '#components/buttons/MainButton.vue'
import DataPrivacyCheckbox from '#components/inputs/DataPrivacyCheckbox.vue'
import EmailInput from '#components/inputs/EmailInput.vue'
import NameInput from '#components/inputs/NameInput.vue'
import AnchorLink from '#components/nav/AnchorLink.vue'
import { createContactForm } from '#mutations/createContactForm'
import { messageRules } from '#src/validation/validation'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const message = ref('')
const formIsLoading = ref(false)
const showFormError = ref(false)
const showFormSuccess = ref(false)

const showInfoTime: number = 5000

const form = ref<HTMLFormElement>()

const { mutate: sendContactForm } = useMutation(createContactForm)

async function submitForm() {
  const isValid = await form.value?.validate()
  if (isValid?.valid) {
    formIsLoading.value = !formIsLoading.value
    try {
      await sendContactForm({
        data: {
          firstName: firstname.value,
          lastName: lastname.value,
          email: email.value,
          content: message.value,
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
@import '#root/src/assets/scss/style';

.contact-form {
  .contact-text {
    border: $border-text-default;
    border-radius: $border-radius-default;

    .v-field {
      border: $border-text-default;
      border-radius: $border-radius-default;

      .v-field__field {
        label.v-label {
          color: $font-color-default;
        }
      }
    }
  }

  .contact-message {
    min-height: 7.5rem;
  }

  .contact-dataprivacy {
    @include text-font-small;

    .dataprivacy-link {
      height: auto;
    }
  }

  .info-text {
    @include form-info-font;

    &.form-success {
      color: $form-info-color-success;
    }

    &.form-error {
      color: $form-info-color-error;
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
