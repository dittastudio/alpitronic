let currentPercentage = 56;

const animateCounter = (
  element,
  start,
  end,
  duration
) => {
  const startTime = performance.now();
  const difference = end - start;

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easing function to match CSS animation
    const easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    const easedProgress = easeInOutQuart(progress);

    const currentValue = Math.round(start + difference * easedProgress);
    element.textContent = `${currentValue}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

export const updateProgress = (element, percentage, animated = false) => {
  const progressBar = element?.querySelector('.progress-bar__percentage');
  const percentageElements = element?.querySelectorAll('[data-js-percentage]');

  if (progressBar) {
    const progressBarElement = progressBar;

    if (animated) {
      progressBarElement.classList.add('progress-bar__percentage--animating');

      // Animate the counter values
      percentageElements?.forEach((el) => {
        animateCounter(el, currentPercentage, percentage, 1500);
      });

      // Remove animation class after animation completes
      setTimeout(() => {
        progressBarElement.classList.remove('progress-bar__percentage--animating');
      }, 1500);
    } else {
      // Instant update for non-animated changes
      percentageElements?.forEach((el) => {
        el.textContent = `${percentage}`;
      });
    }

    progressBarElement.style.setProperty('--percentage', `${percentage}%`);
  }

  currentPercentage = percentage;
};

export const initProgressBar = (element, initialPercentage = 56) => {
  currentPercentage = initialPercentage;
  updateProgress(element, initialPercentage, false);
};

export const getCurrentPercentage = () => currentPercentage;

