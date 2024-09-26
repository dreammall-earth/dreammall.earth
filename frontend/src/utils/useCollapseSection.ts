import { ref, Ref } from 'vue'

import { collapseSection, expandSection } from './collapseSection'

type CollapseState = 'collapsed' | 'expanded' | 'changing'

export const useCollapseSection = (
  section: Ref<HTMLElement | null>,
  initialValue: 'collapsed' | 'expanded' = 'expanded',
) => {
  const collapseState = ref<CollapseState>(initialValue)

  const toggleCollapse = () => {
    if (collapseState.value === 'changing') return

    const previousState = collapseState.value

    collapseState.value = 'changing'

    if (previousState === 'collapsed') {
      expandSection(section.value)
      collapseState.value = 'expanded'
    } else {
      collapseSection(section.value)
      collapseState.value = 'collapsed'
    }
  }

  return { collapseState, toggleCollapse }
}
