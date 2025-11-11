import { wait, easeOutQuart } from '@/utils/helpers'

export interface Options {
  percentage?: number
  limit?: number
  selector?: string
}

class Progress {
  percentage: number
  limit: number = 80
  element: HTMLElement | null = null
  progressBar: HTMLElement | null = null
  progressNumbers: NodeListOf<HTMLElement> | null = null

  constructor(options: Options = {}) {
    const { percentage = 0, limit = 80, selector = '' } = options

    this.percentage = percentage
    this.limit = limit
    this.element = document.querySelector(selector)

    if (!this.element) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    this.progressBar = this.element.querySelector('[data-js-progress-bar]')
    this.progressNumbers = this.element.querySelectorAll('[data-js-progress-number]')

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
      } else {
        this.percentage = percentage
        this.element?.style.setProperty('--percentage', `${percentage}%`)
        this.limitCheck()
      }
    }

    window.requestAnimationFrame(updateCounter)
  }

  private animateNumbers(percentage: number, duration: number): void {
    if (!this.element || !this.progressNumbers) return

    this.progressNumbers.forEach(el => {
      this.animateNumber(el, percentage, duration)
    })
  }

  private setNumberProgress(percentage: number): void {
    if (!this.progressNumbers) return

    this.progressNumbers.forEach(el => {
      el.textContent = `${percentage}`
    })
  }

  private limitCheck(): void {
    if (!this.progressBar) return

    const isOverLimit = this.percentage >= this.limit

    this.progressBar.classList.toggle('!bg-grey-800', isOverLimit)
    this.progressBar.classList.toggle('!text-white', isOverLimit)
    this.progressBar.classList.toggle('!stroke-grey-800', isOverLimit)
  }

  setLimit(count: number): void {
    this.limit = count

    if (!this.element) return

    this.element.style.setProperty('--limit', `${count}`)
    this.limitCheck()
  }

  async updateProgress({
    percentage = 0,
    animate = false,
    duration = 1500,
  }: {
    percentage: number
    animate?: boolean
    duration?: number
  }): Promise<void> {
    if (!this.element) return

    this.limitCheck()

    if (animate) {
      // animateNumbers will assign this.percentage when done animating.
      this.element.style.setProperty('--duration', `${duration}ms`)
      this.animateNumbers(percentage, duration)

      await wait(duration)
      this.element.style.setProperty('--duration', `0ms`)
    } else {
      this.setNumberProgress(percentage)
      this.percentage = percentage
      this.element.style.setProperty('--percentage', `${percentage}%`)
    }
  }

  init(): void {
    if (!this.element) return

    this.updateProgress({ percentage: this.percentage })
    this.setLimit(this.limit)
  }
}

export default Progress
