import { IncomingMessage } from 'http'

import {
  ContactsApi,
  ContactsApiApiKeys,
  CreateContact,
  CreateSmtpEmail,
  CreateUpdateContactModel,
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo'

import { CONFIG } from '#config/config'

// eslint-disable-next-line import/no-mutable-exports
let exportContactsApi = ContactsApi
// eslint-disable-next-line import/no-mutable-exports
let exportTransactionalEmailsApi = TransactionalEmailsApi

class DebugContactsApi extends ContactsApi {
  setApiKey(key: ContactsApiApiKeys, value: string) {
    // eslint-disable-next-line no-console
    console.log(key, value)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async createContact(
    createContact: CreateContact,
    options?: {
      headers: {
        [name: string]: string
      }
    },
  ) {
    // eslint-disable-next-line no-console
    console.log(createContact, options)
    return {
      response: '', // http.IncomingMessage
      body: '', // CreateUpdateContactModel
    } as unknown as { response: IncomingMessage; body: CreateUpdateContactModel }
  }
}

class DebugTransactionalEmailsApi extends TransactionalEmailsApi {
  setApiKey(key: TransactionalEmailsApiApiKeys, value: string) {
    // eslint-disable-next-line no-console
    console.log(key, value)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async sendTransacEmail(
    sendSmtpEmail: SendSmtpEmail,
    options?: {
      headers: {
        [name: string]: string
      }
    },
  ) {
    // eslint-disable-next-line no-console
    console.log(sendSmtpEmail, options)
    return {
      response: '', // http.IncomingMessage
      body: '', // CreateSmtpEmail
    } as unknown as { response: IncomingMessage; body: CreateSmtpEmail }
  }
}

if (CONFIG.BREVO_DEBUG) {
  exportTransactionalEmailsApi = DebugTransactionalEmailsApi
  exportContactsApi = DebugContactsApi
}

export { exportContactsApi as ContactsApi, exportTransactionalEmailsApi as TransactionalEmailsApi }
