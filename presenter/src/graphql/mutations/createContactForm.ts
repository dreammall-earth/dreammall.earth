import { gql } from 'graphql-tag'

export const createContactFormMutation = gql`
  mutation createContactForm($data: ContactFormInput!) {
    createContactForm(contactFormData: $data)
  }
`
