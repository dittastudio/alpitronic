const animateCountdown = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number
): void => {
  const startTime = performance.now()
  const difference = end - start

  const updateCounter = (currentTime: number): void => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentValue = Math.round(start + difference * progress)
    element.textContent = `${currentValue}`

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

export const initTimeOutLoader = (element: HTMLElement | null, seconds: number = 45): void => {
  if (!element) return

  const duration = seconds * 1000 // Convert seconds to milliseconds
  const ring = element.querySelector<SVGCircleElement>('.time-out-loader__ring')
  const numberElement = element.querySelector<HTMLElement>('[data-js-time-out-number]')

  if (ring) {
    const radius = parseFloat(ring.getAttribute('r') || '185')
    const circumference = 2 * Math.PI * radius

    ring.style.setProperty('--circumference', `${circumference.toFixed(2)}`)
    ring.style.setProperty('--countdown-duration', `${seconds}s`)

    // Reset the animation by removing and re-adding it
    ring.style.animation = 'none'
    // Force reflow to ensure the animation reset is applied
    void ring.offsetHeight
    ring.style.animation = ''
  }

  if (numberElement) {
    animateCountdown(numberElement, seconds, 0, duration)
  }
}

