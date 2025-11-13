class PerlinNoise {
  private permutation: number[]

  constructor(seed: number = 0) {
    this.permutation = []

    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i
    }

    const random = this.seededRandom(seed)

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]]
    }

    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i]
    }
  }

  private seededRandom(seed: number) {
    return function () {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number): number {
    return (hash & 1) === 0 ? x : -x
  }

  noise(x: number): number {
    const X = Math.floor(x) & 255
    x -= Math.floor(x)

    const u = this.fade(x)
    const a = this.permutation[X]
    const b = this.permutation[X + 1]

    return this.lerp(this.grad(this.permutation[a], x), this.grad(this.permutation[b], x - 1), u)
  }
}

function randomRange(min: number, max: number, step: number = 0.1): number {
  const steps = Math.round((max - min) / step)
  const randomStep = Math.floor(Math.random() * (steps + 1))
  return Math.round((min + randomStep * step) * 10) / 10
}

function setupResizeIndicator(element: HTMLElement): void {
  const container = element.querySelector('[data-js-resize-container]')
  const resizeIndicator = element.querySelector('[data-js-resize-indicator]')

  if (container && resizeIndicator) {
    const updateResizeIndicatorPosition = () => {
      const { width, height } = container.getBoundingClientRect()
      ;(resizeIndicator as HTMLElement).style.left = `${width}px`
      ;(resizeIndicator as HTMLElement).style.top = `${height}px`
    }

    const resizeObserver = new ResizeObserver(updateResizeIndicatorPosition)
    resizeObserver.observe(container)

    // Initial position update
    requestAnimationFrame(() => {
      updateResizeIndicatorPosition()
    })
  }
}

const disableInjectedCSS = (component: string = '') => {
  const run = (component: string, element: Element) => {
    // Development Output:
    const tag = element as HTMLLinkElement | HTMLStyleElement
    const viteId = tag.getAttribute('data-vite-dev-id')

    if (viteId && !viteId.includes(`/${component}/`)) {
      console.log('⚠️ Disabled CSS file:', viteId)
      tag.disabled = true

      return
    } else if (viteId && viteId.includes(`/${component}/`)) {
      console.log('✅ Enable CSS file:', viteId)
      tag.disabled = false

      return
    }

    // Production Output:
    const rel = element.getAttribute('rel')
    const href = element.getAttribute('href')

    if ((rel === 'stylesheet' || rel === 'modulepreload') && href && !href.includes(`/${component}`)) {
      console.log('⚠️ Disabled CSS file:', href)
      tag.disabled = true

      return
    } else if (href && href.includes(`/${component}/`)) {
      console.log('✅ Enable CSS file:', href)
      tag.disabled = false

      return
    }
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element

          run(component, element)
        }
      }
    }
  })

  observer.observe(document.head, { childList: true })

  document.head.querySelectorAll('link, style').forEach(element => {
    run(component, element)
  })
}

export { PerlinNoise, randomRange, setupResizeIndicator, disableInjectedCSS }
