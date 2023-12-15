/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer } from '@apollo/server'
import { ContactForm } from '@prisma/client'

import { prisma } from '#src/prisma'
import { createServer } from '#src/server/server'

let testServer: ApolloServer

jest.mock('#config/config', () => {
  return {
    BREVO_KEY: '',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})

beforeAll(async () => {
  testServer = await createServer()
})

describe('ContactFormResolver', () => {
  describe('createContactForm mutation', () => {
    describe('with correct data', () => {
      it('returns true', async () => {
        const response = await testServer.executeOperation({
          query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              content: 'Hello DreamMall!',
              email: 'peter@lustig.de',
            },
          },
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              createContactForm: true,
            },
          },
        })
      })

      it('has the contact form stored in the database', async () => {
        const result: ContactForm[] = await prisma.contactForm.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            content: 'Hello DreamMall!',
            email: 'peter@lustig.de',
            createdAt: expect.any(Date),
            brevoSuccess: null,
          },
        ])
      })
    })
  })

  describe('contactForm query', () => {
    it('returns true', async () => {
      const response = await testServer.executeOperation({
        query: `query { contactForm }`,
      })
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            contactForm: true,
          },
        },
      })
    })
  })
})
