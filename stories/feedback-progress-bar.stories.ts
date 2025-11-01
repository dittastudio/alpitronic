import '@/css/app.css';
import '@/components/feedback-progress-bar/feedback-progress-bar.css';
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw';

// Cache the element outside the render function
let cachedElement: HTMLElement | null = null;

export default {
  title: 'Alpitronic/feedback-progress-bar',
  tags: ['autodocs'],
  render: ({ percentage = 56 }: { percentage?: number }) => {
    // Create element only once
    if (!cachedElement) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = template;
      cachedElement = wrapper.firstChild as HTMLElement;
    }

    // Only update the values that changed
    const progressBar = cachedElement?.querySelector('.progress-bar__percentage');
    if (progressBar) {
      (progressBar as HTMLElement).style.setProperty('--percentage', `${percentage}%`);
    }

    // Update the percentage values using IDs
    const percentageValue = cachedElement?.querySelector('#progress-percentage-value');
    const percentageOverlay = cachedElement?.querySelector('#progress-percentage-overlay');

    if (percentageValue) {
      percentageValue.textContent = `${percentage}`;
    }

    if (percentageOverlay) {
      percentageOverlay.textContent = `${percentage}`;
    }

    return cachedElement;
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage from 0 to 100'
    },
  },
};

export const Default = {
  args: {},
};
