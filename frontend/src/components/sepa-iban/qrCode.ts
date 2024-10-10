// source: https://github.com/derhuerst/sepa-payment-qr-code
import IBAN from 'iban'

const SERVICE_TAG = 'BCD'
const VERSION = '002'
const CHARACTER_SET = 1
const IDENTIFICATION_CODE = 'SCT'

const assertNonEmptyString = (val: unknown, name: string) => {
  if (typeof val !== 'string' || !val) {
    throw new SepaValidationError(name + ' must be a non-empty string.')
  }
}

type QrCodeData = {
  name: string
  iban: string
  bic?: string
  amount?: number
  purposeCode?: string
  structuredReference?: string
  unstructuredReference?: string
  information?: string
}

export class SepaValidationError extends Error {
  constructor(message: string) {
    super(message) // (1)
    this.name = 'SepaValidationError' // (2)
  }
}

export const generateQrCode = (data: QrCodeData) => {
  if (!data) throw new SepaValidationError('data must be an object.')

  // > AT-21 Name of the Beneficiary
  assertNonEmptyString(data.name, 'data.name')
  if (data.name.length > 70) throw new SepaValidationError('data.name must have <=70 characters')

  // > AT-23 BIC of the Beneficiary Bank
  if (data.bic) {
    assertNonEmptyString(data.bic, 'data.bic')
    if (data.bic.length > 11) throw new SepaValidationError('data.bic must have <=11 characters')
    // todo: validate more?
  }

  // > AT-20 Account number of the Beneficiary
  // > Only IBAN is allowed.
  assertNonEmptyString(data.iban, 'data.iban')
  if (!IBAN.isValid(data.iban)) {
    throw new SepaValidationError('data.iban must be a valid iban code.')
  }

  // > AT-04 Amount of the Credit Transfer in Euro
  // > Amount must be 0.01 or more and 999999999.99 or less
  if (data.amount !== null) {
    if (typeof data.amount !== 'number')
      throw new SepaValidationError('data.amount must be a number or null.')
    if (data.amount < 0.01 || data.amount > 999999999.99) {
      throw new SepaValidationError('data.amount must be >=0.01 and <=999999999.99.')
    }
  }

  // > AT-44 Purpose of the Credit Transfer
  if (data.purposeCode) {
    assertNonEmptyString(data.purposeCode, 'data.purposeCode')
    if (data.purposeCode.length > 4)
      throw new SepaValidationError('data.purposeCode must have <=4 characters')
    // todo: validate against AT-44
  }

  // > AT-05 Remittance Information (Structured)
  // > Creditor Reference (ISO 11649 RF Creditor Reference may be used)
  if (data.structuredReference) {
    assertNonEmptyString(data.structuredReference, 'data.structuredReference')
    if (data.structuredReference.length > 35)
      throw new SepaValidationError('data.structuredReference must have <=35 characters')
    // todo: validate against AT-05
  }
  // > AT-05 Remittance Information (Unstructured)
  if (data.unstructuredReference) {
    assertNonEmptyString(data.unstructuredReference, 'data.unstructuredReference')
    if (data.unstructuredReference.length > 140)
      throw new SepaValidationError('data.unstructuredReference must have <=140 characters')
  }
  if ('structuredReference' in data && 'unstructuredReference' in data) {
    throw new SepaValidationError(
      'Use either data.structuredReference or data.unstructuredReference.',
    )
  }

  // > Beneficiary to originator information
  if (data.information) {
    assertNonEmptyString(data.information, 'data.information')
    if (data.information.length > 70)
      throw new SepaValidationError('data.information must have <=70 characters')
  }

  return [
    SERVICE_TAG,
    VERSION,
    CHARACTER_SET,
    IDENTIFICATION_CODE,
    data.bic,
    data.name,
    IBAN.electronicFormat(data.iban),
    data.amount === null ? '' : 'EUR' + data.amount.toFixed(2),
    data.purposeCode || '',
    data.structuredReference || '',
    data.unstructuredReference || '',
    data.information || '',
  ].join('\n')
}
