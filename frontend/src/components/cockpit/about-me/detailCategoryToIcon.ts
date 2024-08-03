import type { UserDetailCategory } from '#stores/userStore.js'

export function detailCategoryToIcon(category: UserDetailCategory) {
  switch (category) {
    case 'place':
      return '$place'
    case 'work':
      return '$working'
    case 'language':
      return '$world'
    case 'education':
      return '$education'
    case 'feeling':
      return '$feeling'
    default:
      throw new Error(`Unknown category`)
  }
}
