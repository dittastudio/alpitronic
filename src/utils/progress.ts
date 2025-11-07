const INITIAL_DURATION = 1500
const DEFAULT_DURATION = 200
let currentPercentage = 56
let currentLimit = 80

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

const updateLimitVisibility = (
  element: HTMLElement | null | undefined,
  percentage: number,
  limit: number
): void => {
  if (!element) return

  const shouldHide = percentage >= limit
  element.classList.toggle('opacity-0', shouldHide)
  element.classList.toggle('scale-95', shouldHide)
}

const updateBarStyling = (
  element: HTMLElement | null | undefined,
  percentage: number,
  limit: number
): void => {
  if (!element) return

  const isOverLimit = percentage >= limit
  element.classList.toggle('!bg-medium-gray', isOverLimit)
  element.classList.toggle('!text-white', isOverLimit)
  element.classList.toggle('!stroke-medium-gray', isOverLimit)

}

const animateNumber = (
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

    const easedProgress = easeOutQuart(progress)

    const currentValue = Math.round(start + difference * easedProgress)
    element.textContent = `${currentValue}`

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

const updatePercentageNumber = (
  element: HTMLElement,
  percentageNumbers: NodeListOf<HTMLElement>,
  currentValue: number,
  targetValue: number,
  animated: boolean
): void => {
  if (animated) {
    const durationStr = getComputedStyle(element)
      .getPropertyValue('--progress-duration')
      .trim()
    const duration = parseFloat(durationStr) || DEFAULT_DURATION

    element.classList.add('is-animating')

    percentageNumbers.forEach((el) => {
      animateNumber(el, currentValue, targetValue, duration)
    })

    setTimeout(() => {
      element.classList.remove('is-animating')
    }, duration)
  } else {
    percentageNumbers.forEach((el) => {
      el.textContent = `${targetValue}`
    })
  }
}

export const updateProgress = (
  element: HTMLElement | null,
  percentage: number,
  animated: boolean = false
): void => {
  if (!element) return

  const percentageBar = element.querySelector<HTMLElement>('[data-js-progress-bar]')
  const percentageNumbers = element.querySelectorAll<HTMLElement>('[data-js-progress-number]')
  const percentageLimit = element.querySelector<HTMLElement>('[data-js-progress-limit]')
  const percentageRing = element.querySelector<SVGCircleElement>('[data-js-progress-ring]')

  if (percentageNumbers) {
    updatePercentageNumber(
      element,
      percentageNumbers,
      currentPercentage,
      percentage,
      animated
    )
  }

  if (percentageLimit) {
    updateLimitVisibility(
      percentageLimit,
      percentage,
      currentLimit,
    )
  }

  if (percentageBar) {
    updateBarStyling(
      percentageBar,
      percentage,
      currentLimit,
    )
  }

  if (percentageRing) {
    setCircleProgress(
      percentageRing,
      percentage,
    )
  }

  element.style.setProperty('--percentage', `${percentage}%`)

  currentPercentage = percentage
}

export const initProgressBar = (
  element: HTMLElement | null,
  initialPercentage: number = 56
): void => {
  if (!element) return

  currentPercentage = initialPercentage
  updateProgress(element, initialPercentage, false)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      // Set initial duration and add is-animating for reveal
      element.style.setProperty('--progress-duration', `${INITIAL_DURATION}ms`)
      element.classList.add('is-animating')

      // After initial animation, remove is-animating and set default duration
      setTimeout(() => {
        element.classList.remove('is-animating')
        element.style.setProperty('--progress-duration', `${DEFAULT_DURATION}ms`)
      }, INITIAL_DURATION)


      element.classList.add('is-ready')
    })
  })
}

export const setBackgroundColor = (element: HTMLElement | null, color: string): void => {
  if (!element) return
  element.style.backgroundColor = color
}

export const setStrokeColor = (element: HTMLElement | null, color: string): void => {
  if (!element) return
  element.style.stroke = color
}

export const setTextColor = (element: HTMLElement | null, isDark: boolean = false): void => {
  if (!element) return
  element.classList.toggle('text-white', !isDark)
  element.classList.toggle('text-black', isDark)
}

export const setLimitCount = (element: HTMLElement | null, count: number): void => {
  if (!element) return
  const limitNumberElement = element.querySelector<HTMLElement>('[data-js-progress-limit-number]')

  if (element) {
    element.style.setProperty('--lines-count', `${count}`)
  }

  if (limitNumberElement) {
    limitNumberElement.textContent = `${count}`
  }

  currentLimit = count
}

export const setCircleProgress = (
  ring: SVGCircleElement | null,
  percentage: number
): void => {
  if (!ring) return

  const radius = parseFloat(ring.getAttribute('r') || '180')
  const circumference = 2 * Math.PI * radius
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  const offset = circumference - (clampedPercentage / 100) * circumference

  ring.style.setProperty('--circumference', `${circumference.toFixed(0)}`)
  ring.style.setProperty('--offset', `${offset.toFixed(0)}`)
}