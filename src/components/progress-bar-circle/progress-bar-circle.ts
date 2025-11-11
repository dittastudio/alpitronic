import { wait, easeOutQuart } from '@/utils/helpers'

interface Options {
  percentage?: number
  limit?: number
  selector?: string
}

class Progress {
  private percentage: number
  private limit: number = 80
  private element: HTMLElement | null = null
  private progressBar: HTMLElement | null = null
  private progressNumbers: NodeListOf<HTMLElement> | null = null

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

  private setCircleProgress(percentage: number): void {
    if (!this.progressBar) return

    const radius = parseFloat(this.progressBar.getAttribute('r') || '180')
    const circumference = 2 * Math.PI * radius
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    const offset = circumference - (clampedPercentage / 100) * circumference

    this.progressBar.style.setProperty('--circumference', `${circumference.toFixed(0)}`)
    this.progressBar.style.setProperty('--offset', `${offset.toFixed(0)}`)
  }

  private limitCheck(): void {
    if (!this.progressBar) return

    const isOverLimit = this.percentage >= this.limit

    this.progressBar.classList.toggle('!bg-grey-800', isOverLimit)
    this.progressBar.classList.toggle('!text-white', isOverLimit)
    this.progressBar.classList.toggle('!stroke-grey-800', isOverLimit)
  }

  public setLimit(count: number): void {
    this.limit = count

    if (!this.element) return

    this.element.style.setProperty('--limit', `${count}`)
    this.limitCheck()
  }

  public setProgress(percentage: number, animate: boolean = false, duration: number = 1500): void {
    this.setCircleProgress(percentage)
    this.limitCheck()

    if (animate) {
      // animateNumbers will assign this.percentage when done animating.
      this.animateNumbers(percentage, duration)
    } else {
      this.setNumberProgress(percentage)
      this.percentage = percentage
      this.element?.style.setProperty('--percentage', `${percentage}%`)
    }
  }

  public async animateProgress(percentage: number, duration: number = 1500): Promise<void> {
    if (!this.element) return

    this.element.style.setProperty('--progress-duration', `${duration}ms`)
    this.setProgress(percentage, true, duration)

    await wait(duration)

    this.element.style.setProperty('--progress-duration', `0ms`)
  }

  private init(): void {
    if (this.element) {
      this.setProgress(this.percentage)
      this.setLimit(this.limit)
    }
  }
}

export default Progress
