const INITIAL_DURATION = 1500;
const DEFAULT_DURATION = 200;
let currentPercentage = 56;
let currentLinesCount = 80;

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const animateCounter = (element: HTMLElement, start: number, end: number, duration: number): void => {
  const startTime = performance.now();
  const difference = end - start;

  const updateCounter = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeOutQuart(progress);

    const currentValue = Math.round(start + difference * easedProgress);
    element.textContent = `${currentValue}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

export const updateProgress = (element: HTMLElement | null, percentage: number, animated: boolean = false): void => {
  const percentageMask = element?.querySelector<HTMLElement>('[data-js-percentage-mask]');
  const percentageBar = percentageMask?.querySelector<HTMLElement>('[data-js-percentage-bar]');
  const percentageNumbers = element?.querySelectorAll<HTMLElement>('[data-js-percentage-number]');
  const percentageLimit = element?.querySelector<HTMLElement>('[data-js-percentage-limit]');

  if (percentageMask) {
    if (animated) {
      const durationStr = getComputedStyle(percentageMask).getPropertyValue('--progress-duration').trim();
      const duration = parseFloat(durationStr) || DEFAULT_DURATION;

      percentageMask.classList.add('is-animating');

      percentageNumbers?.forEach(el => {
        animateCounter(el, currentPercentage, percentage, duration);
      });

      setTimeout(() => {
        percentageMask.classList.remove('is-animating');
      }, duration);
    } else {
      percentageNumbers?.forEach(el => {
        el.textContent = `${percentage}`;
      });
    }

    percentageMask.style.setProperty('--percentage', `${percentage}%`);
  }

  // Hide percentage limit when reaching lines count threshold or higher
  if (percentageLimit) {
    if (percentage >= currentLinesCount) {
      percentageLimit.classList.add('opacity-0');
      percentageLimit.classList.add('scale-95');
    } else {
      percentageLimit.classList.remove('opacity-0');
      percentageLimit.classList.remove('scale-95');
    }
  }

  // Change progress bar background to medium gray when reaching lines count threshold or higher
  if (percentageBar) {
    if (percentage >= currentLinesCount) {
      percentageBar.classList.add('!bg-grey-800');
      percentageBar.classList.add('!text-white');
    } else {
      percentageBar.classList.remove('!bg-grey-800');
      percentageBar.classList.remove('!text-white');
    }
  }

  currentPercentage = percentage;
};

export const initProgressBar = (element: HTMLElement | null, initialPercentage: number = 56): void => {
  const percentageMask = element?.querySelector<HTMLElement>('[data-js-percentage-mask]');

  currentPercentage = initialPercentage;
  updateProgress(element, initialPercentage, false);

  // Double RAF to ensure DOM is ready for transitions
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (percentageMask) {
        // Set initial duration and add is-animating for reveal
        percentageMask.style.setProperty('--progress-duration', `${INITIAL_DURATION}ms`);
        percentageMask.classList.add('is-animating');

        // After initial animation, remove is-animating and set default duration
        setTimeout(() => {
          percentageMask.classList.remove('is-animating');
          percentageMask.style.setProperty('--progress-duration', `${DEFAULT_DURATION}ms`);
        }, INITIAL_DURATION);
      }

      element?.classList.add('is-ready');
    });
  });
};

export const setBackgroundColor = (element: HTMLElement | null, color: string): void => {
  if (!element) return;
  element.style.backgroundColor = color;
};

export const setTextColor = (element: HTMLElement | null, isDark: boolean = false): void => {
  if (!element) return;
  element.classList.toggle('text-white', !isDark);
  element.classList.toggle('text-black', isDark);
};

export const setLinesCount = (element: HTMLElement | null, count: number): void => {
  if (!element) return;
  const limitNumberElement = element.querySelector<HTMLElement>('[data-js-percentage-limit-number]');

  if (element) {
    element.style.setProperty('--lines-count', `${count}`);
  }

  if (limitNumberElement) {
    limitNumberElement.textContent = `${count}`;
  }

  currentLinesCount = count;
};

export const setCircleProgress = (ring: SVGCircleElement | null, percentage: number): void => {
  if (!ring) return;

  const radius = parseFloat(ring.getAttribute('r') || '180');
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clampedPercentage / 100) * circumference;

  // Initialize dasharray if needed
  if (!ring.style.strokeDasharray) {
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
  }

  ring.style.strokeDashoffset = `${offset}`;
};
