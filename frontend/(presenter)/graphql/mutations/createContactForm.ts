import { gql } from 'graphql-tag'

export const createContactForm = gql`
  mutation createContactForm($data: ContactFormInput!) {
    createContactForm(contactFormData: $data)
  }
`
