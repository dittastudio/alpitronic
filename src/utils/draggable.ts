export function makeDraggable(element: HTMLElement, container: HTMLElement) {
  let isDragging = false
  let startMouseX = 0
  let startMouseY = 0
  let startElementX = 0
  let startElementY = 0
  let useBottomPositioning = false

  element.style.cursor = 'grab'
  element.style.position = 'absolute'

  // Get initial position
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  let currentLeft = elementRect.left - containerRect.left
  let currentTop = elementRect.top - containerRect.top

  // Set initial position explicitly
  element.style.left = `${currentLeft}px`
  element.style.top = `${currentTop}px`
  element.style.bottom = 'auto'
  element.style.transform = 'none'

  element.addEventListener('mousedown', dragStart)
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', dragEnd)

  // Touch events for mobile
  element.addEventListener('touchstart', dragStart)
  document.addEventListener('touchmove', drag)
  document.addEventListener('touchend', dragEnd)

  function dragStart(e: MouseEvent | TouchEvent) {
    if (e.target === element || element.contains(e.target as Node)) {
      // Check if click is on resize handle (bottom-right corner)
      const rect = element.getBoundingClientRect()
      const resizeHandleSize = 20 // Size of the resize handle area in pixels

      let clientX: number
      let clientY: number

      if (e.type === 'touchstart') {
        clientX = (e as TouchEvent).touches[0].clientX
        clientY = (e as TouchEvent).touches[0].clientY
      } else {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
      }

      // Calculate if click is within the resize handle area
      const isInResizeArea =
        clientX >= rect.right - resizeHandleSize &&
        clientY >= rect.bottom - resizeHandleSize

      // Don't start dragging if clicking on resize handle
      if (isInResizeArea) {
        return
      }

      isDragging = true
      element.style.cursor = 'grabbing'

      startMouseX = clientX
      startMouseY = clientY

      startElementX = currentLeft
      startElementY = currentTop
    }
  }

  function drag(e: MouseEvent | TouchEvent) {
    if (isDragging) {
      e.preventDefault()

      let mouseX: number
      let mouseY: number

      if (e.type === 'touchmove') {
        mouseX = (e as TouchEvent).touches[0].clientX
        mouseY = (e as TouchEvent).touches[0].clientY
      } else {
        mouseX = (e as MouseEvent).clientX
        mouseY = (e as MouseEvent).clientY
      }

      const deltaX = mouseX - startMouseX
      const deltaY = mouseY - startMouseY

      let newLeft = startElementX + deltaX
      let newTop = startElementY + deltaY

      // Get current bounds
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      // Constrain within container
      newLeft = Math.max(0, Math.min(newLeft, containerRect.width - elementRect.width))
      newTop = Math.max(0, Math.min(newTop, containerRect.height - elementRect.height))

      currentLeft = newLeft
      currentTop = newTop

      // Check if element is at the bottom
      const isAtBottom = newTop >= containerRect.height - elementRect.height

      if (isAtBottom) {
        // Use bottom positioning
        useBottomPositioning = true
        element.style.top = 'auto'
        element.style.bottom = '0px'
        element.style.left = `${newLeft}px`
      } else {
        // Use top positioning
        useBottomPositioning = false
        element.style.bottom = 'auto'
        element.style.top = `${newTop}px`
        element.style.left = `${newLeft}px`
      }
    }
  }

  function dragEnd() {
    if (isDragging) {
      isDragging = false
      element.style.cursor = 'grab'
    }
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('mousedown', dragStart)
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', dragEnd)
    element.removeEventListener('touchstart', dragStart)
    document.removeEventListener('touchmove', drag)
    document.removeEventListener('touchend', dragEnd)
  }
}

