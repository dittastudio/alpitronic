import { wait, easeOutQuart } from '@/utils/helpers'

interface Options {
  percentage?: number
  selector?: string
}

class Progress {
  private percentage: number
  private element: HTMLElement | null = null
  private percentageBar: HTMLElement | null = null
  private percentageNumbers: NodeListOf<HTMLElement> | null = null
  private percentageLimit: HTMLElement | null = null
  private percentageRing: SVGCircleElement | null = null
  private currentLimit: number = 80

  constructor(options: Options = {}) {
    const { percentage = 0, selector = '[data-js-progress]' } = options

    this.percentage = percentage
    this.element = document.querySelector(selector)

    if (!this.element) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    this.percentageBar = this.element.querySelector('[data-js-progress-bar]')
    this.percentageNumbers = this.element.querySelectorAll('[data-js-progress-number]')
    this.percentageLimit = this.element.querySelector('[data-js-progress-limit]')
    this.percentageRing = this.element.querySelector('[data-js-progress-ring]')

    this.init()
  }

  private animateNumber(element: HTMLElement, percentage: number, duration: number): void {
    const startTime = performance.now()
    const difference = percentage - this.percentage

    const updateCounter = (currentTime: number): void => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const currentValue = Math.round(this.percentage + difference * easedProgress)

      element.textContent = `${currentValue}`

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter)
      }
    }

    window.requestAnimationFrame(updateCounter)
  }

  public animateNumbers(percentage: number, duration: number): void {
    if (!this.element || !this.percentageNumbers) return

    this.percentageNumbers.forEach(el => {
      this.animateNumber(el, percentage, duration)
    })
  }

  private setNumberProgress(percentage: number): void {
    if (!this.percentageNumbers) return

    this.percentageNumbers.forEach(el => {
      el.textContent = `${percentage}`
    })
  }

  private setCircleProgress(percentage: number): void {
    if (!this.percentageRing) return

    const radius = parseFloat(this.percentageRing.getAttribute('r') || '180')
    const circumference = 2 * Math.PI * radius
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    const offset = circumference - (clampedPercentage / 100) * circumference

    this.percentageRing.style.setProperty('--circumference', `${circumference.toFixed(0)}`)
    this.percentageRing.style.setProperty('--offset', `${offset.toFixed(0)}`)
  }

  public setProgress(percentage: number, animate: boolean = false, duration: number = 1500): void {
    this.setCircleProgress(percentage)

    if (animate) {
      this.animateNumbers(percentage, duration)
    } else {
      this.setNumberProgress(percentage)
    }
  }

  public async animateTo(percentage: number, duration: number = 1500): Promise<void> {
    if (!this.element) return

    this.element.style.setProperty('--progress-duration', `${duration}ms`)
    this.setProgress(percentage, true, duration)

    await wait(duration)

    this.element.style.setProperty('--progress-duration', `0ms`)
  }

  private init(): void {
    if (this.element) {
      this.setProgress(this.percentage)
    }
  }
}

export default Progress
