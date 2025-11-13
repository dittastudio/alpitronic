type Options = {
  steps?: string[]
  step?: number
  selector?: string
}

class ProgressStepped {
  steps: string[] = []
  step: number = 0
  element: HTMLElement | null = null

  constructor(options: Options = {}) {
    const { steps = [], step = 0, selector = '' } = options

    this.steps = steps
    this.step = step
    this.element = document.querySelector(selector)

    if (!this.element) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    this.init()
  }

  setStep(step = 0): void {
    this.step = step
  }

  private init(): void {
    if (!this.element) return

    this.setStep(this.step)
  }
}

export default ProgressStepped
