const DEFAULT_DURATION = 1500
let currentPercentage = 56

const animateCounter = (
  element,
  start,
  end,
  duration
) => {
  const startTime = performance.now()
  const difference = end - start

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
    const easedProgress = easeOutQuart(progress)

    const currentValue = Math.round(start + difference * easedProgress)
    element.textContent = `${currentValue}`

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

export const updateProgress = (element, percentage, animated = false) => {
  const progressBar = element?.querySelector('[data-js-percentage-bar]')
  const percentageElements = element?.querySelectorAll('[data-js-percentage-number]')

  if (progressBar) {
    const progressBarElement = progressBar

    if (animated) {
      const duration = parseFloat(
        getComputedStyle(progressBarElement).getPropertyValue('--progress-duration')
      )

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

export const initProgressBar = (element, initialPercentage = 56) => {
  const progressBar = element?.querySelector('[data-js-percentage-bar]')

  // Set that sweet CSS variable
  if (progressBar) {
    progressBar.style.setProperty('--progress-duration', `${DEFAULT_DURATION}ms`)
  }

  currentPercentage = initialPercentage
  updateProgress(element, initialPercentage, false)

  // what is this FILTH?!
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element?.classList.add('is-ready')
    })
  })
}

export const getCurrentPercentage = () => currentPercentage

