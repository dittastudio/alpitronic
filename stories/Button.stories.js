import { fn } from 'storybook/test';
import './Button.css';
import template from './Button.html?raw';

export default {
  title: 'Alpitronic/Button',
  tags: ['autodocs'],
  render: ({ label, primary, size = 'medium', backgroundColor, onClick }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const btn = wrapper.querySelector('.storybook-button') || wrapper.querySelector('button');
    if (!btn) return wrapper;

    if (label != null) btn.textContent = label;

    const sizeClasses = ['storybook-button--small', 'storybook-button--medium', 'storybook-button--large'];
    btn.classList.remove('storybook-button--primary', 'storybook-button--secondary', ...sizeClasses);
    const modeClass = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    btn.classList.add(`storybook-button--${size}`, modeClass);

    if (backgroundColor) btn.style.backgroundColor = backgroundColor;

    if (typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    return btn;
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};
