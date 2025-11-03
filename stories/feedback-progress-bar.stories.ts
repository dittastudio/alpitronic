import '@/css/app.css';
import '@/components/feedback-progress-bar/feedback-progress-bar.css';
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw';
import { initProgressBar, updateProgress } from '@/components/feedback-progress-bar/feedback-progress-bar.js';

// Cache the element for the Storybook demo
let cachedElement: HTMLElement | null = null;

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
      initProgressBar(cachedElement, percentage);
    } else {
      // Update progress when slider changes
      updateProgress(cachedElement, percentage, false);
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
      updateProgress(cachedElement!, clampedPercentage, true);
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
