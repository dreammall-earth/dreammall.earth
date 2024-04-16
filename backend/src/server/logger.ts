import { GraphQLRequestContext, GraphQLRequestContextWillSendResponse } from '@apollo/server'

import logger from '#src/logger'

import { Context } from './context'

export default {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line @typescript-eslint/require-await
  async requestDidStart(requestContext: GraphQLRequestContext<Context>) {
    logger.debug('Apollo Request', requestContext.request)
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse(requestContext: GraphQLRequestContextWillSendResponse<Context>) {
        logger.debug('Apollo Response', requestContext.request, requestContext.response.body)
      },
    }
  },
}
