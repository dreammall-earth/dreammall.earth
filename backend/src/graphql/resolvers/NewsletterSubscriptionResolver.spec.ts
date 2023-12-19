/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer } from '@apollo/server'
import { NewsletterSubscription } from '@prisma/client'

import { prisma } from '#src/prisma'
import { createServer } from '#src/server/server'
import { sendContactToBrevo } from '#api/NewsletterBrevo'

let testServer: ApolloServer

jest.mock('#api/NewsletterBrevo', () => {
  return {
    sendContactToBrevo: jest.fn(),
  }
})

beforeAll(async () => {
  testServer = await createServer()
})

describe('NewsletterSubscriptionResolver', () => {
  describe('subscribeToNewsletter mutation', () => {
    describe('email is no email', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation({
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
        })
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
        const response = await testServer.executeOperation({
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
        })
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
        const response = await testServer.executeOperation({
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
        })
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
        const response = await testServer.executeOperation({
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
        })
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
      it('returns true', async () => {
        const response = await testServer.executeOperation({
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
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              subscribeToNewsletter: true,
            },
          },
        })
      })

      it('has the newsletter subscription form stored in the database', async () => {
        const result: NewsletterSubscription[] = await prisma.newsletterSubscription.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
            createdAt: expect.any(Date),
            brevoSuccess: null,
          },
        ])
      })
    })

    it('calls sendContactFormEmail', () => {
      expect(sendContactToBrevo).toBeCalled()
    })
  })
})
