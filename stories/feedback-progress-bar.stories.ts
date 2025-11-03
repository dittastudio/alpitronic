import '@/css/app.css';
import '@/components/feedback-progress-bar/feedback-progress-bar.css';
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw';

// Cache the element outside the render function
let cachedElement: HTMLElement | null = null;
let currentPercentage = 56;

const animateCounter = (
  element: Element,
  start: number,
  end: number,
  duration: number
) => {
  const startTime = performance.now();
  const difference = end - start;

  const updateCounter = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easing function to match CSS animation
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);

    const currentValue = Math.round(start + difference * easedProgress);
    element.textContent = `${currentValue}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

const updateProgress = (percentage: number, animated = false) => {
  const progressBar = cachedElement?.querySelector('.progress-bar__percentage');
  const percentageValue = cachedElement?.querySelector('#progress-percentage-value');
  const percentageOverlay = cachedElement?.querySelector('#progress-percentage-overlay');

  if (progressBar) {
    const progressBarElement = progressBar as HTMLElement;

    if (animated) {
      progressBarElement.classList.add('progress-bar__percentage--animating');

      // Animate the counter values
      if (percentageValue) {
        animateCounter(percentageValue, currentPercentage, percentage, 1500);
      }
      if (percentageOverlay) {
        animateCounter(percentageOverlay, currentPercentage, percentage, 1500);
      }

      // Remove animation class after animation completes
      setTimeout(() => {
        progressBarElement.classList.remove('progress-bar__percentage--animating');
      }, 1500);
    } else {
      // Instant update for non-animated changes
      if (percentageValue) {
        percentageValue.textContent = `${percentage}`;
      }
      if (percentageOverlay) {
        percentageOverlay.textContent = `${percentage}`;
      }
    }

    progressBarElement.style.setProperty('--percentage', `${percentage}%`);
  }

  currentPercentage = percentage;
};

export default {
  title: 'Alpitronic/feedback-progress-bar',
  tags: ['autodocs'],
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100'
    },
  },
};

export const Default = {
  args: {
    percentage: 56,
  },
  render: ({ percentage = 56 }: { percentage?: number }) => {
    // Create the progress bar element
    if (!cachedElement) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = template;
      cachedElement = wrapper.firstChild as HTMLElement;
      updateProgress(percentage, false);
    } else {
      // Update progress when slider changes
      updateProgress(percentage, false);
    }

    // Create a container for controls and component
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem;';

    // Create controls wrapper
    const controls = document.createElement('div');
    controls.style.cssText = 'display: flex; gap: 1rem; align-items: center; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem;';

    // Create input for target percentage
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.value = '80';
    input.style.cssText = 'padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; width: 100px;';

    // Create label
    const label = document.createElement('label');
    label.textContent = 'Target %:';
    label.style.cssText = 'font-weight: 500;';

    // Create animate button
    const button = document.createElement('button');
    button.textContent = 'Animate to Target';
    button.style.cssText = 'padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;';
    button.onmouseover = () => button.style.background = '#2563eb';
    button.onmouseout = () => button.style.background = '#3b82f6';

    // Handle animation
    button.onclick = () => {
      const targetPercentage = parseInt(input.value) || 0;
      const clampedPercentage = Math.max(0, Math.min(100, targetPercentage));
      updateProgress(clampedPercentage, true);
    };

    // Assemble controls
    controls.appendChild(label);
    controls.appendChild(input);
    controls.appendChild(button);

    // Assemble container
    container.appendChild(controls);
    container.appendChild(cachedElement);

    return container;
  },
};
