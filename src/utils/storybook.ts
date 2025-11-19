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

const makeResizable = (element: HTMLElement) => {
  const minWidth = 20
  const minHeight = 20

  let isResizing = false
  let isDragging = false
  let currentHandle: string | null = null
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let startLeft = 0
  let startTop = 0

  const handles = ['nw', 'ne', 'sw', 'se']

  handles.forEach(position => {
    const handle = document.createElement('div')

    handle.className = `sb-resize-handle sb-resize-handle-${position}`
    handle.dataset.position = position

    element.appendChild(handle)

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      isResizing = true
      currentHandle = position
      startX = e.clientX
      startY = e.clientY
      startWidth = element.offsetWidth
      startHeight = element.offsetHeight
      startLeft = element.offsetLeft
      startTop = element.offsetTop

      document.body.style.cursor = getComputedStyle(handle).cursor
    })
  })

  element.addEventListener('mousedown', (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('sb-resize-handle')) {
      return
    }

    e.preventDefault()

    isDragging = true
    startX = e.clientX
    startY = e.clientY
    startLeft = element.offsetLeft
    startTop = element.offsetTop

    document.body.style.cursor = 'move'
  })

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (isResizing && currentHandle) {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop

      if (currentHandle.includes('e')) {
        newWidth = Math.max(minWidth, startWidth + deltaX)
      }

      if (currentHandle.includes('w')) {
        newWidth = Math.max(minWidth, startWidth - deltaX)
        newLeft = startLeft + (startWidth - newWidth)
      }

      if (currentHandle.includes('s')) {
        newHeight = Math.max(minHeight, startHeight + deltaY)
      }

      if (currentHandle.includes('n')) {
        newHeight = Math.max(minHeight, startHeight - deltaY)
        newTop = startTop + (startHeight - newHeight)
      }

      element.style.width = `${newWidth}px`
      element.style.height = `${newHeight}px`
      element.style.left = `${newLeft}px`
      element.style.top = `${newTop}px`

      info.textContent = `${newWidth} x ${newHeight}`
    } else if (isDragging) {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      element.style.left = `${startLeft + deltaX}px`
      element.style.top = `${startTop + deltaY}px`
    }
  })

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false
      currentHandle = null
      document.body.style.cursor = ''
    }

    if (isDragging) {
      isDragging = false
      document.body.style.cursor = ''
    }
  })

  const info = document.createElement('div')
  info.className = 'sb-resize-info'

  setTimeout(() => {
    info.textContent = `${element.offsetWidth} x ${element.offsetHeight}`
    element.appendChild(info)
  }, 0)

  return element
}

export { PerlinNoise, randomRange, makeResizable }
