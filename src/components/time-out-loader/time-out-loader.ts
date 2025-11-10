export const initTimeOutLoader = (element: HTMLElement | null, seconds: number = 45): void => {
  if (!element) return

  const ring = element.querySelector<SVGCircleElement>('.time-out-loader__ring')
  const numberElement = element.querySelector<HTMLElement>('[data-js-time-out-number]')

  if (ring) {
    const radius = parseFloat(ring.getAttribute('r') || '185')
    const circumference = 2 * Math.PI * radius

    ring.style.setProperty('--circumference', `${circumference.toFixed(2)}`)
  }

  // Set countdown duration and starting number on the parent element
  element.style.setProperty('--countdown-duration', `${seconds}s`)
  element.style.setProperty('--countdown-seconds', `${seconds}`)

  // Reset animations by removing and re-adding them
  if (ring) {
    ring.style.animation = 'none'
    void ring.getBoundingClientRect()
    ring.style.animation = ''
  }

  if (numberElement) {
    numberElement.style.animation = 'none'
    void numberElement.getBoundingClientRect()
    numberElement.style.animation = ''
  }
}

