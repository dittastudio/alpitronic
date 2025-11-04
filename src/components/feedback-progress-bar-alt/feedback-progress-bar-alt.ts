const INITIAL_DURATION = 1500
const DEFAULT_DURATION = 300
let currentPercentage = 56

const animateCounter = (
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

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)
    const easedProgress = easeOutQuart(progress)

    const currentValue = Math.round(start + difference * easedProgress)
    element.textContent = `${currentValue}`

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

export const updateProgress = (
  element: HTMLElement | null,
  percentage: number,
  animated: boolean = false
): void => {
  const progressBar = element?.querySelector<HTMLElement>('[data-js-percentage-bar]')
  const percentageElements = element?.querySelectorAll<HTMLElement>('[data-js-percentage-number]')

  if (progressBar) {
    const progressBarElement = progressBar

    if (animated) {
      // Read the current duration (either 1500ms initially or 300ms after)
      const durationStr = getComputedStyle(progressBarElement)
        .getPropertyValue('--progress-duration')
        .trim()
      const duration = parseFloat(durationStr) || DEFAULT_DURATION

      progressBarElement.classList.add('is-animating')

      percentageElements?.forEach((el) => {
        animateCounter(el, currentPercentage, percentage, duration)
      })

      setTimeout(() => {
        progressBarElement.classList.remove('is-animating')
      }, duration)
    } else {
      percentageElements?.forEach((el) => {
        el.textContent = `${percentage}`
      })
    }

    progressBarElement.style.setProperty('--percentage', `${percentage}%`)
  }

  currentPercentage = percentage
}

export const initProgressBar = (
  element: HTMLElement | null,
  initialPercentage: number = 56
): void => {
  const progressBar = element?.querySelector<HTMLElement>('[data-js-percentage-bar]')

  currentPercentage = initialPercentage
  updateProgress(element, initialPercentage, false)

  // Double RAF to ensure DOM is ready for transitions
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (progressBar) {
        // Set initial duration and add is-animating for reveal
        progressBar.style.setProperty('--progress-duration', `${INITIAL_DURATION}ms`)
        progressBar.classList.add('is-animating')

        // After initial animation, remove is-animating and set default duration
        setTimeout(() => {
          progressBar.classList.remove('is-animating')
          progressBar.style.setProperty('--progress-duration', `${DEFAULT_DURATION}ms`)
        }, INITIAL_DURATION)
      }

      element?.classList.add('is-ready')
    })
  })
}

export const getCurrentPercentage = (): number => currentPercentage

export const setBackgroundColor = (element: HTMLElement | null, color: string): void => {
  if (!element) return
  element.style.backgroundColor = color
}
