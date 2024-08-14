import { UserDetailCategory } from '#stores/userStore.js'

export const detailCategories: UserDetailCategory[] = [
  'place',
  'work',
  'education',
  'feeling',
  'language',
]

export function detailCategoryToIcon(category: UserDetailCategory) {
  switch (category) {
    case 'place':
      return 'mdi mdi-map-marker-outline'
    case 'work':
      return 'mdi mdi-briefcase-outline'
    case 'language':
      return 'mdi mdi-web'
    case 'education':
      return 'mdi mdi-school-outline'
    case 'feeling':
      return 'mdi mdi-emoticon-outline'
    default:
      throw new Error(`Unknown category`)
  }
}
