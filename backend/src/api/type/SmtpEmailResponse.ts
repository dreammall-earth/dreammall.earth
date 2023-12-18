// eslint-disable-next-line import/no-namespace
import * as http from 'http'

// eslint-disable-next-line import/no-namespace
import * as SibApiV3Sdk from '@getbrevo/brevo'

export type SmtpEmailResponse = {
  response: http.IncomingMessage
  body: SibApiV3Sdk.CreateSmtpEmail
}
