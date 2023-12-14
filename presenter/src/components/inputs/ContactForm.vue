<template>
  <v-sheet color="transparent">
    <v-form ref="form" class="contact-form" @submit.prevent="submitForm">
      <v-row>
        <v-col>
          <v-text-field
            v-model="firstname"
            name="firstname"
            class="contact-text"
            :label="$t('menu.footer.contactForm.firstName')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            required
            :rules="[() => !!firstname || $t('menu.footer.contactForm.fieldRequired')]"
          ></v-text-field>

          <v-text-field
            v-model="email"
            name="email"
            class="contact-text mt-4"
            :label="$t('menu.footer.contactForm.mail')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            type="email"
            required
            :rules="[() => !!email || $t('menu.footer.contactForm.fieldRequired')]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="lastname"
            name="lastname"
            class="contact-text"
            :label="$t('menu.footer.contactForm.lastName')"
            variant="solo"
            color="#3D4753"
            bg-color="rgba(174, 179, 189, 0.50)"
            hide-details="auto"
            flat
            rounded="xl"
            required
            :rules="[() => !!lastname || $t('menu.footer.contactForm.fieldRequired')]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pb-0">
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
            :rules="[() => !!message || $t('menu.footer.contactForm.fieldRequired')]"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex align-start">
          <v-checkbox
            v-model="dataprivacy"
            name="dataprivacy"
            color="rgba(174, 179, 189, 0.50)"
            value="false"
            hide-details="auto"
            :center-affix="false"
            density="compact"
            required
            :rules="[() => !!dataprivacy || $t('menu.footer.contactForm.fieldRequired')]"
          >
          </v-checkbox>
          <span class="ml-4 pt-2 contact-agb"
            >{{ $t('menu.footer.contactForm.privacy') }}
            <AnchorLink
              class=""
              href="#"
              variant="text"
              :label="$t('menu.footer.contactForm.privacyLinkLabel')"
            ></AnchorLink
          ></span>
        </v-col>
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col>
          <MainButton
            class="my-2 w-100"
            variant="submit"
            size="auto"
            :label="$t('menu.footer.contactForm.submitBtn')"
            type="submit"
          >
          </MainButton>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'

import AnchorLink from '#components/nav/AnchorLink.vue'
import { createContactFormMutation } from '#mutations/createContactForm'

import MainButton from './MainButton.vue'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const message = ref('')
const dataprivacy = ref(0)

const form = ref<HTMLFormElement>()

const { mutate: sendContactForm, onDone, onError } = useMutation(createContactFormMutation)

onDone(() => {
  // eslint-disable-next-line no-console
  console.log('successfully sent form')
})

// eslint-disable-next-line promise/prefer-await-to-callbacks
onError((err) => {
  // eslint-disable-next-line no-console
  console.log(err.message)
})

async function submitForm() {
  const isValid = await form.value?.validate()
  if (isValid?.valid) {
    console.log('HERE')
    await sendContactForm({
      data: {
        firstName: firstname.value,
        lastName: lastname.value,
        email: email.value,
        content: message.value,
      },
    })
  }
}
</script>

<style scoped lang="scss">
.contact-form {
  .contact-text {
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

  .contact-message {
    min-height: 7.5rem;
  }

  .contact-agb {
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
