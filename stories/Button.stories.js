import { fn } from 'storybook/test';
import '../css/app.css';
import './Button.css';
import template from './Button.html?raw';

export default {
  title: 'Alpitronic/Button',
  tags: ['autodocs'],
  render: ({ label, primary, size = 'medium', backgroundColor, onClick }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const btn = wrapper.querySelector('button');

    if (!btn) {
      return wrapper;
    }

    if (label != null) {
      btn.textContent = label;
    }

    const sizeClasses = ['button--small', 'button--medium', 'button--large'];
    btn.classList.remove('button--primary', 'button--secondary', ...sizeClasses);

    const modeClass = primary ? 'button--primary' : 'button--secondary';
    btn.classList.add(`button--${size}`, modeClass);

    if (backgroundColor) {
      btn.style.backgroundColor = backgroundColor;
    }

    if (typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    return wrapper.firstChild;
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
  args: { onClick: fn() },
};

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
