import isEmail from 'validator/lib/isEmail'

import i18n from '#plugins/i18n'

const MAX_NAME_LENGTH = 50
const MAX_MESSAGE_LENGTH = 255
const MAX_EMAIL_LENGTH = 100

export const nameRules = [(value: string) => maxLengthRule(value, MAX_NAME_LENGTH)]

export const messageRules = [(value: string) => maxLengthRule(value, MAX_MESSAGE_LENGTH)]

export const emailRules = [
  (value: string) => maxLengthRule(value, MAX_EMAIL_LENGTH),
  (value: string) => isEmail(value) || i18n.global.t('menu.footer.contactForm.fieldNoEmail'),
]

const maxLengthRule = (value: string, maxLength: number) => {
  if (!value) return i18n.global.t('menu.footer.contactForm.fieldRequired')
  if (value.length > maxLength) return i18n.global.t('menu.footer.contactForm.fieldTooLong')
  return true
}
