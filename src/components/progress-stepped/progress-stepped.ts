import { wait } from '@/utils/helpers'

type Options = {
  steps?: string[]
  step?: number
  selector?: string
}

class ProgressStepped {
  steps: string[] = []
  step: number = 0
  element: HTMLElement | null = null
  list: HTMLElement | null = null

  constructor(options: Options = {}) {
    const { steps = [], step = 1, selector = '' } = options

    this.steps = steps
    this.step = step
    this.element = document.querySelector(selector)

    if (!this.element) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    this.list = this.element.querySelector('[data-js-list]')

    this.init()
  }

  private async setAmount(animate?: boolean): Promise<void> {
    if (!this.element) return

    const amount = this.steps.length ? 100 - (this.step / this.steps.length) * 100 : 100

    if (animate) {
      this.element.style.setProperty('--amount', `100%`)
      await wait(1000)
    }

    this.element.style.setProperty('--amount', `${amount}%`)
  }

  setStep(step = 1, animate?: boolean): void {
    this.step = step

    this.setAmount(animate)
  }

  setSteps(steps: string[], animate?: boolean): void {
    if (!this.list) return

    this.list.innerHTML = ''
    this.steps = steps

    this.steps.forEach(step => {
      const li = document.createElement('li')
      li.textContent = step
      this.list?.appendChild(li)
    })

    this.setAmount(animate)
  }

  private init(): void {
    if (!this.element) return

    this.setSteps(this.steps, true)
    this.setStep(this.step, true)
  }
}

export default ProgressStepped
