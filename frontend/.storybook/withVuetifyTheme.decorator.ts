import { h } from 'vue'
import StoryWrapper, { DEFAULT_THEME, DEFAULT_HEIGHT } from './StoryWrapper.vue'

export const withVuetifyTheme = (storyFn, context) => {
  // Pull our global theme variable, fallback to DEFAULT_THEME
  const themeName = context.globals.theme || DEFAULT_THEME

  // Check if story specific height is defined, otherwise use global height or default
  const appHeight = context.parameters.appHeight || context.globals.appHeight || DEFAULT_HEIGHT

  const story = storyFn()

  return () => {
    return h(
      StoryWrapper,
      { themeName, appHeight }, // Props for StoryWrapper
      {
        // Puts your story into StoryWrapper's "story" slot with your story args
        story: () => h(story, { ...context.args }),
      },
    )
  }
}
