import { wait } from '@/utils/helpers'

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

const disableInjectedCSS = (component: string | string[] = '') => {
  const head = document.head
  let isMoving = false

  const isComponentElement = (element: Element): boolean => {
    const dataViteDevId = element.getAttribute('data-vite-dev-id')
    const href = element.getAttribute('href')

    return (
      ((dataViteDevId?.includes(`/${component}`) || href?.includes(`/${component}`)) &&
        (dataViteDevId?.endsWith(`.css`) || href?.endsWith(`.css`))) ??
      false
    )
  }

  const observer = new MutationObserver(async mutations => {
    if (isMoving) return

    const addedNodes = mutations.flatMap(mutation => Array.from(mutation.addedNodes))
    const lastAdded = addedNodes[addedNodes.length - 1]

    if (lastAdded?.nodeType === Node.ELEMENT_NODE) {
      const element = lastAdded as Element
      const isComponentCSS = isComponentElement(element)

      if (!isComponentCSS) {
        const componentElement = Array.from(head.querySelectorAll('link, style')).find(el => isComponentElement(el))

        if (componentElement) {
          isMoving = true
          head.appendChild(componentElement)

          await wait(1)
          isMoving = false
        }
      }
    }
  })

  observer.observe(document.head, { childList: true })

  document.addEventListener('DOMContentLoaded', () => {
    const elements = Array.from(document.head.querySelectorAll('link, style'))
    const chosen = elements.filter(el => isComponentElement(el))

    chosen.forEach(element => {
      head.appendChild(element)
    })
  })
}

export { PerlinNoise, randomRange, disableInjectedCSS }
