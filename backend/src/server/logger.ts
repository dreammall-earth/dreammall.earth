import logger from '#src/logger'
import {
  GraphQLRequest,
  GraphQLRequestContext,
  GraphQLRequestContextWillSendResponse,
} from '@apollo/server'

export default {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line @typescript-eslint/require-await
  async requestDidStart(requestContext: GraphQLRequestContext<GraphQLRequest>) {
    // eslint-disable-next-line no-console
    logger.debug('Apollo Request', requestContext.request)
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<GraphQLRequest>,
      ) {
        // eslint-disable-next-line no-console
        logger.debug('Apollo Response', requestContext.request, requestContext.response.body)
      },
    }
  },
}
