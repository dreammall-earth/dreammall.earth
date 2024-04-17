import { randomBytes } from 'crypto'

import { GraphQLRequestContext, GraphQLRequestContextWillSendResponse } from '@apollo/server'

import logger from '#src/logger'

import { Context } from './context'

export default {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line @typescript-eslint/require-await
  async requestDidStart(requestContext: GraphQLRequestContext<Context>) {
    const isIntrospectionQuery = requestContext.request.operationName === 'IntrospectionQuery'
    const qID = randomBytes(4).toString('hex')
    const logRequest = ['Apollo Request', qID, requestContext.request.operationName]
    logRequest.push(JSON.stringify(requestContext.request.query))
    if (requestContext.request.variables) {
      logRequest.push(JSON.stringify(requestContext.request.variables))
    }
    if (!isIntrospectionQuery) logger.debug(...logRequest)
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<Context>) {
        const logResponse = ['Apollo Response', qID]
        if (requestContext.errors) {
          logger.error(...logResponse, JSON.stringify(requestContext.errors))
          return
        }

        logResponse.push(JSON.stringify(requestContext.response.body))
        if (!isIntrospectionQuery) logger.debug(...logResponse)
      },
    }
  },
}
