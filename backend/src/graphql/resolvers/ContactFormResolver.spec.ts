/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer } from '@apollo/server'
import { ContactForm } from '@prisma/client'

import { prisma } from '#src/prisma'
import { createServer } from '#src/server/server'

let testServer: ApolloServer

jest.mock('../../config/config', () => {
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_KEY = '1234'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_NAME = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_EMAIL = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_BASE = '1'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_USER = '2'
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
