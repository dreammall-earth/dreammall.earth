import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { deleteAll } from '#test/helpers'
import { mockContextValue } from '#test/mockContextValue'

import type { Context } from '#src/context'

let testServer: ApolloServer<Context>

describe('ContactFormResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  beforeEach(async () => {
    await deleteAll()
    jest.clearAllMocks()
  })

  describe('createContactForm mutation', () => {
    describe('email is no email', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
                content: 'Hello DreamMall!',
                email: 'peter(at)lustig.de',
              },
            },
          },
          { contextValue: mockContextValue() },
        )
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('email is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
                content: 'Hello DreamMall!',
                email:
                  'Aloysius.Bartholomew.Chauncey.Constantine.Devereaux.Ellington.Feliciano.Giuseppe.Horatio.Ignatius@lustig.de',
              },
            },
          },
          { contextValue: mockContextValue() },
        )
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('first name is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Aloysius Bartholomew Chauncey Constantine Devereaux',
                lastName: 'Lustig',
                content: 'Hello DreamMall!',
                email: 'peter@lustig.de',
              },
            },
          },
          { contextValue: mockContextValue() },
        )
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('last name is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Daenerys',
                lastName:
                  'Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
                content: 'Hello DreamMall!',
                email: 'daenerys@red-keep.westeros',
              },
            },
          },
          { contextValue: mockContextValue() },
        )
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('content is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: ContactFormInput!) {
                    createContactForm(contactFormData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
                content: `Aus welchen Anlässen hat der Bundesnachrichtendienst (BND) im ersten
Kalendervierteljahr 2022 bei Medien ohne Inanspruchnahme anwaltlicher
Hilfe um Korrekturen von Berichterstattungen ersuchen lassen (bitte je-
weils nach Datum, Medium, Anlass und Kosten auflisten)?`,
                email: 'peter@lustig.de',
              },
            },
          },
          { contextValue: mockContextValue() },
        )
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('with correct data', () => {
      const contextValue = mockContextValue()
      const action = async () => {
        return testServer.executeOperation(
          {
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
          },
          { contextValue },
        )
      }

      it('returns true', async () => {
        const response = await action()
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              createContactForm: true,
            },
          },
        })
      })

      it('calls sendContactFormEmail', async () => {
        await action()
        expect(contextValue.brevo.sendContactEmails).toHaveBeenCalledWith({
          firstName: 'Peter',
          lastName: 'Lustig',
          content: 'Hello DreamMall!',
          email: 'peter@lustig.de',
        })
      })

      it('writes event to database', async () => {
        await action()
        const result = await prisma.event.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          expect.objectContaining({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            type: 'CONTACTFORM_SEND',
            involvedEmail: 'peter@lustig.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          }),
        ])
      })
    })
  })
})
