import Progress, { type Options } from '@/utils/progress'

class ProgressBarCircle extends Progress {
  constructor(options: Options = {}) {
    const { percentage = 0, limit = 80, selector = '' } = options

    super({ percentage, limit, selector })

    this.init()
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

  setProgress({ percentage = 0, animate = false }: { percentage: number; animate?: boolean }): void {
    this.setCircleProgress(percentage)
    super.updateProgress({ percentage, animate })
  }

  override init(): void {
    if (!this.element) return

    this.setCircleProgress(this.percentage)
    super.updateProgress({ percentage: this.percentage })
    super.setLimit(this.limit)
  }
}

export default ProgressBarCircle
