/* class BasicLogging {
  requestDidStart({queryString, parsedQuery, variables}) {
    const query = queryString || print(parsedQuery);
    console.log(query);
    console.log(variables);
  }

  willSendResponse({graphqlResponse}) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
} */

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
    console.log('Apollo Request', requestContext.request)
    return {
      // eslint-disable-next-line @typescript-eslint/require-await
      async willSendResponse(
        requestContext: GraphQLRequestContextWillSendResponse<GraphQLRequest>,
      ) {
        // eslint-disable-next-line no-console
        console.log('Apollo Response', requestContext.request, requestContext.response.body)
      },
    }
  },
}
