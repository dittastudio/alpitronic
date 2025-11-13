import Progress, { type Options } from '@/utils/progress'

class ProgressStepped extends Progress {
  constructor(options: Options = {}) {
    const { percentage = 0, limit = 80, selector = '' } = options

    super({ percentage, limit, selector })

    this.init()
  }

  setProgress({
    percentage = 0,
    animate = false,
    duration = 1500,
  }: {
    percentage: number
    animate?: boolean
    duration?: number
  }): void {
    super.updateProgress({ percentage, animate, duration })
  }

  override init(): void {
    if (!this.element) return

    super.updateProgress({ percentage: this.percentage })
    super.setLimit(this.limit)
  }
}

export default ProgressStepped
