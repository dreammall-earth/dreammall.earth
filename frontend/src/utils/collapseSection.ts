export function collapseSection(element: HTMLElement | null) {
  if (!element) return

  // get the height of the element's inner content, regardless of its actual size
  const sectionHeight = element.scrollHeight

  // temporarily disable all css transitions
  const elementTransition = element.style.transition
  element.style.transition = ''

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function () {
    element.style.height = sectionHeight + 'px'
    element.style.overflow = 'hidden'
    element.style.transition = elementTransition

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function () {
      element.style.height = 0 + 'px'
    })
  })

  // mark the section as "currently collapsed"
  element.setAttribute('data-collapsed', 'true')
}

export function expandSection(element: HTMLElement | null) {
  if (!element) return
  // get the height of the element's inner content, regardless of its actual size
  const sectionHeight = element.scrollHeight

  // have the element transition to the height of its inner content
  element.style.height = sectionHeight + 'px'

  const listener = () => {
    // remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', listener)

    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.removeProperty('height')
    // same for "overflow"
    element.style.removeProperty('overflow')
  }

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', listener)

  // mark the section as "currently not collapsed"
  element.setAttribute('data-collapsed', 'false')
}
