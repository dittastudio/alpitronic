const INITIAL_DURATION = 1500;
const DEFAULT_DURATION = 200;
let currentPercentage = 56;

const animateCounter = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number
): void => {
  const startTime = performance.now();
  const difference = end - start;

  const updateCounter = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
    const easedProgress = easeOutQuart(progress);

    const currentValue = Math.round(start + difference * easedProgress);
    element.textContent = `${currentValue}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

export const updateProgress = (
  element: HTMLElement | null,
  percentage: number,
  animated: boolean = false
): void => {
  const progressMask = element?.querySelector<HTMLElement>('[data-js-percentage-mask]');
  const progressBar = progressMask?.querySelector<HTMLElement>('[data-js-percentage-bar]');
  const percentageElements = element?.querySelectorAll<HTMLElement>('[data-js-percentage-number]');
  const percentageLimit = element?.querySelector<HTMLElement>('[data-js-percentage-limit]');

  if (progressMask) {
    if (animated) {
      const durationStr = getComputedStyle(progressMask)
        .getPropertyValue('--progress-duration')
        .trim();
      const duration = parseFloat(durationStr) || DEFAULT_DURATION;

      progressMask.classList.add('is-animating');

      percentageElements?.forEach((el) => {
        animateCounter(el, currentPercentage, percentage, duration);
      });

      setTimeout(() => {
        progressMask.classList.remove('is-animating');
      }, duration);
    } else {
      percentageElements?.forEach((el) => {
        el.textContent = `${percentage}`;
      });
    }

    progressMask.style.setProperty('--percentage', `${percentage}%`);
  }

  // Hide percentage limit when reaching 80% or higher
  if (percentageLimit) {
    if (percentage >= 80) {
      percentageLimit.classList.add('opacity-0');
      percentageLimit.classList.add('scale-95');
    } else {
      percentageLimit.classList.remove('opacity-0');
      percentageLimit.classList.remove('scale-95');
    }
  }

  // Change progress bar background to medium gray when reaching 80% or higher
  if (progressBar) {
    if (percentage >= 80) {
      progressBar.classList.add('!bg-medium-gray');
      progressBar.classList.add('!text-white');
    } else {
      progressBar.classList.remove('!bg-medium-gray');
      progressBar.classList.remove('!text-white');
    }
  }

  currentPercentage = percentage;
};

export const initProgressBar = (
  element: HTMLElement | null,
  initialPercentage: number = 56
): void => {
  const progressMask = element?.querySelector<HTMLElement>('[data-js-percentage-mask]');

  currentPercentage = initialPercentage;
  updateProgress(element, initialPercentage, false);

  // Double RAF to ensure DOM is ready for transitions
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (progressMask) {
        // Set initial duration and add is-animating for reveal
        progressMask.style.setProperty('--progress-duration', `${INITIAL_DURATION}ms`);
        progressMask.classList.add('is-animating');

        // After initial animation, remove is-animating and set default duration
        setTimeout(() => {
          progressMask.classList.remove('is-animating');
          progressMask.style.setProperty('--progress-duration', `${DEFAULT_DURATION}ms`);
        }, INITIAL_DURATION);
      }

      element?.classList.add('is-ready');
    });
  });
};

export const getCurrentPercentage = (): number => currentPercentage;

export const setBackgroundColor = (element: HTMLElement | null, color: string): void => {
  if (!element) return;
  element.style.backgroundColor = color;
};

export const setTextColor = (element: HTMLElement | null, isDark: boolean = false): void => {
  if (!element) return;
  element.classList.toggle('text-white', !isDark);
  element.classList.toggle('text-black', isDark);
};
