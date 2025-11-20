import { wait } from '@/utils/helpers'

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
  progressLimit: HTMLElement | null = null

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
    this.progressLimit = this.element.querySelector('[data-js-progress-limit]')

    this.init()
  }

  private limitCheck(): void {
    if (!this.progressBar) return

    const isOverLimit = this.percentage >= this.limit

    this.progressBar.classList.toggle('!bg-grey-800', isOverLimit)
    this.progressBar.classList.toggle('!text-white', isOverLimit)
    this.progressBar.classList.toggle('!stroke-grey-800', isOverLimit)

    if (!this.progressLimit) return

    this.progressLimit.classList.toggle('opacity-0', isOverLimit)
    this.progressLimit.classList.toggle('scale-95', isOverLimit)
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

    this.element.style.setProperty('--percentage', `${percentage}`)

    if (animate) {
      this.element.style.setProperty('--duration', `${duration}ms`)

      await wait(duration)
      this.element.style.setProperty('--duration', `0ms`)

      // REVISIT THIS LOGIC. NEED TO UPDATE PERCENTAGE CONTINUOUSLY DURING ANIMATION FOR ACCURATE STATE.
      this.percentage = percentage
      this.limitCheck()
    } else {
      this.percentage = percentage
    }
  }

  init(): void {
    if (!this.element) return

    this.updateProgress({ percentage: this.percentage })
    this.setLimit(this.limit)
  }
}

export default Progress
