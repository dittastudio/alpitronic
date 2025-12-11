interface Options {
  data?: number[]
  xLabel?: string[]
  yLabel?: string[]
  selector?: string
}

class ChartLine {
  private data: number[]
  private xLabel: string[]
  private yLabel: string[]
  private chart: HTMLElement | null = null
  private dataContainer: HTMLElement | null = null
  private xLabelContainer: HTMLElement | null = null
  private yLabelContainer: HTMLElement | null = null

  constructor(options: Options = {}) {
    const { data = [], xLabel = [], yLabel = [], selector = '[data-js-chart-line]' } = options

    this.data = data
    this.xLabel = xLabel
    this.yLabel = yLabel
    this.chart = document.querySelector(selector)

    if (!this.chart) {
      console.warn(`Element with selector "${selector}" not found`)
      return
    }

    this.dataContainer = this.chart.querySelector('[data-js-data]')
    this.xLabelContainer = this.chart.querySelector('[data-js-x-label]')
    this.yLabelContainer = this.chart.querySelector('[data-js-y-label]')

    this.init()
  }

  private drawData(container: HTMLElement): void {
    if (!container || !Array.isArray(this.data) || !this.data.length) {
      return
    }

    const points: string[] = []

    this.data.forEach((data, index) => {
      const x = (index / (this.data.length - 1)) * 100
      const y = 100 - data * 100

      points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    })

    // Draw the line.
    const svgPolyLine = container.querySelector('polyline')

    if (svgPolyLine) {
      svgPolyLine.setAttribute('points', points.join(' '))
    }

    // Draw the area.
    const svgPolygon = container.querySelector('polygon')

    if (svgPolygon) {
      points.push(`100,100`, `0,100`)
      svgPolygon.setAttribute('points', points.join(' '))
    }
  }

  private drawXLabel(container: HTMLElement): void {
    container.innerHTML = ''

    if (!Array.isArray(this.xLabel) || !this.xLabel.length) {
      return
    }

    const items: HTMLElement[] = []

    this.xLabel.forEach((label, index) => {
      const li = document.createElement('li')

      li.textContent = label
      li.className = `opacity-0 translate-y-2 transition-[opacity,translate] duration-700 ease-out`
      li.style.transitionDelay = `${index * this.xLabel.length * 25}ms`

      container.appendChild(li)
      items.push(li)
    })

    requestAnimationFrame(() => {
      items.forEach(li => {
        li.classList.remove('opacity-0', 'translate-y-2')
      })
    })
  }

  private drawYLabel(container: HTMLElement): void {
    container.innerHTML = ''

    if (!Array.isArray(this.yLabel) || !this.yLabel.length) {
      return
    }

    const items: HTMLElement[] = []

    this.yLabel.forEach((label, index) => {
      const li = document.createElement('li')

      li.textContent = label
      li.className = `opacity-0 translate-y-2 transition-[opacity,translate] duration-700 ease-out`
      li.style.transitionDelay = `${index * this.xLabel.length * 25}ms`

      container.appendChild(li)
      items.push(li)
    })

    requestAnimationFrame(() => {
      items.forEach(li => {
        li.classList.remove('opacity-0', 'translate-y-2')
      })
    })
  }

  private init(): void {
    if (this.dataContainer) {
      this.drawData(this.dataContainer)
    }

    if (this.xLabelContainer) {
      this.drawXLabel(this.xLabelContainer)
    }

    if (this.yLabelContainer) {
      this.drawYLabel(this.yLabelContainer)
    }
  }
}

export default ChartLine
