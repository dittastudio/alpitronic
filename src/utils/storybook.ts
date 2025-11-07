class PerlinNoise {
  private permutation: number[];

  constructor(seed: number = 0) {
    this.permutation = [];

    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    const random = this.seededRandom(seed);

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }

    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i];
    }
  }

  private seededRandom(seed: number) {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number): number {
    return (hash & 1) === 0 ? x : -x;
  }

  noise(x: number): number {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);

    const u = this.fade(x);
    const a = this.permutation[X];
    const b = this.permutation[X + 1];

    return this.lerp(this.grad(this.permutation[a], x), this.grad(this.permutation[b], x - 1), u);
  }
}

function randomRange(min: number, max: number, step: number = 0.1): number {
  const steps = Math.round((max - min) / step);
  const randomStep = Math.floor(Math.random() * (steps + 1));
  return Math.round((min + randomStep * step) * 10) / 10;
}

function setupResizeIndicator(element: HTMLElement): void {
  const container = element.querySelector('[data-js-resize-container]');
  const resizeIndicator = element.querySelector('[data-js-resize-indicator]');

  if (container && resizeIndicator) {
    const updateResizeIndicatorPosition = () => {
      const { width, height } = container.getBoundingClientRect();
      (resizeIndicator as HTMLElement).style.left = `${width}px`;
      (resizeIndicator as HTMLElement).style.top = `${height}px`;
    };

    const resizeObserver = new ResizeObserver(updateResizeIndicatorPosition);
    resizeObserver.observe(container);

    // Initial position update
    requestAnimationFrame(() => {
      updateResizeIndicatorPosition();
    });
  }
}

export { PerlinNoise, randomRange, setupResizeIndicator };
