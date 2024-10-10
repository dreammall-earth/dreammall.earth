import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { createMockConfig } from '#test/mockConfig'
import { mockContextValue as defaultMockContext } from '#test/mockContextValue'

import type { createBrevoClient } from '#src/api/Brevo'
import type { Context } from '#src/context'

let testServer: ApolloServer<Context>

const mockContextValue = () => {
  const config = {
    ...createMockConfig(),
    BREVO_KEY: 'MY KEY',
    BREVO_ADMIN_NAME: 'Bibi Bloxberg',
    BREVO_ADMIN_EMAIL: 'bibi@bloxberg.de',
    BREVO_NEWSLETTER_TEMPLATE_OPTIN: 3,
  }
  const brevo = {
    sendContactEmails: jest.fn(),
    subscribeToNewsletter: jest.fn().mockResolvedValue(true),
    confirmNewsletter: jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValue({ email: 'peter@lustig.de' }),
  } as ReturnType<typeof createBrevoClient>
  return defaultMockContext({ config, brevo })
}

describe('NewsletterSubscriptionResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('subscribeToNewsletter mutation', () => {
    describe('email is no email', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
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
            query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
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
            query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Aloysius Bartholomew Chauncey Constantine Devereaux',
                lastName: 'Lustig',
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
            query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Daenerys',
                lastName:
                  'Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
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

    describe('with correct data', () => {
      let response: Awaited<ReturnType<typeof testServer.executeOperation>>
      let contextValue: Context
      beforeEach(async () => {
        contextValue = mockContextValue()
        await prisma.event.deleteMany()
        response = await testServer.executeOperation(
          {
            query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data)
                  }`,
            variables: {
              data: {
                firstName: 'Peter',
                lastName: 'Lustig',
                email: 'peter@lustig.de',
              },
            },
          },
          { contextValue },
        )
      })

      it('calls subscribeToNewsletter', () => {
        expect(contextValue.brevo.subscribeToNewsletter).toHaveBeenCalledTimes(1)
        expect(contextValue.brevo.subscribeToNewsletter).toHaveBeenCalledWith(
          'Peter',
          'Lustig',
          'peter@lustig.de',
        )
      })

      it('returns true', () => {
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              subscribeToNewsletter: true,
            },
          },
        })
      })

      it('writes event to database', async () => {
        const result = await prisma.event.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          expect.objectContaining({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            type: 'NEWSLETTER_SUBSCRIBE',
            involvedEmail: 'peter@lustig.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          }),
        ])
      })
    })
  })

  describe('confirmNewsletter mutation', () => {
    let response: Awaited<ReturnType<typeof testServer.executeOperation>>
    let contextValue: Context
    beforeAll(async () => {
      jest.clearAllMocks()
      await prisma.event.deleteMany()
      contextValue = mockContextValue()
      response = await testServer.executeOperation(
        {
          query: `mutation($code: String!) {
                  confirmNewsletter(code: $code)
                }`,
          variables: {
            code: '1234567890abcdef',
          },
        },
        { contextValue },
      )
    })

    it('returns false on first call', () => {
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            confirmNewsletter: false,
          },
        },
      })
    })

    it('calls confirmNewsletter', () => {
      expect(contextValue.brevo.confirmNewsletter).toHaveBeenCalledTimes(1)
      expect(contextValue.brevo.confirmNewsletter).toHaveBeenCalledWith('1234567890abcdef')
    })

    describe('on second call', () => {
      beforeAll(async () => {
        await prisma.event.deleteMany()
        response = await testServer.executeOperation(
          {
            query: `mutation($code: String!) {
              confirmNewsletter(code: $code)
            }`,
            variables: {
              code: '1234567890abcdef',
            },
          },
          { contextValue },
        )
      })

      it('returns true', () => {
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              confirmNewsletter: true,
            },
          },
        })
      })

      it('writes event to database', async () => {
        const result = await prisma.event.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          expect.objectContaining({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            type: 'NEWSLETTER_CONFIRM',
            involvedEmail: 'peter@lustig.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          }),
        ])
      })
    })
  })
})
