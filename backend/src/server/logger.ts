import { randomBytes } from 'crypto'

import { GraphQLRequestContext } from '@apollo/server'

import logger from '#src/logger'

import { Context } from './context'

export default {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line @typescript-eslint/require-await
  async requestDidStart(requestContext: GraphQLRequestContext<Context>) {
    const qID = randomBytes(4).toString('hex')
    const logElements = ['Apollo Request', qID, requestContext.request.operationName]
    if (requestContext.request.operationName !== 'IntrospectionQuery') {
      logElements.push(JSON.stringify(requestContext.request.query))
    }
    if (requestContext.request.variables) {
      logElements.push(JSON.stringify(requestContext.request.variables))
    }
    logger.debug(...logElements)
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse() {
        logger.debug('Apollo Response', qID)
      },
    }
  },
}
