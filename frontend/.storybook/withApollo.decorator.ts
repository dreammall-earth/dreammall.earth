import { h } from 'vue'

import ApolloWrapper from './ApolloWrapper.vue'

export const withApollo = (storyFn: () => any, context: { args: object }) => {
  const story = storyFn()

  return () => {
    return h(ApolloWrapper, null, {
      // Puts your story into the wrapper's slot with your story args
      story: () => h(story, { ...context.args }),
    })
  }
}
