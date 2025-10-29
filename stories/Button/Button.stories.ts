import { fn } from 'storybook/test';
import '../../css/app.css';
import './Button.css';
import template from './Button.html?raw';

export default {
  title: 'Alpitronic/Button',
  tags: ['autodocs'],
  render: ({
      label = 'Button',
      fullWidth = false,
      rounded = 'small',
      backgroundColor,
      textColor,
      icon = false,
      reversed = false,
      stacked = false,
      onClick
    }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const btn: HTMLElement | null = wrapper.querySelector('.button');

    if (!btn) {
      return wrapper;
    }

    const btnLabel = btn.querySelector('.button__label');

    if (btnLabel && label) {
      btnLabel.textContent = label;
    }

    if (fullWidth) {
      btn.classList.add('button--full');
    }

    if (backgroundColor) {
      btn.style.backgroundColor = backgroundColor;
    }

    if (textColor) {
      btn.style.color = textColor;
    }

    if (rounded) {
      btn.classList.add(`button--rounded-${rounded}`);
    }

    if (reversed) {
      btn.classList.add('button--reversed');
    }

    if (stacked) {
      btn.classList.add('button--stacked');
    }

    if (icon) {
      btn.classList.add('button--icon');
    }

    if (typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    return wrapper.firstChild;
  },
  argTypes: {
    label: { control: 'text' },
    textColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    fullWidth: { control: 'boolean' },

    rounded: {
      control: { type: 'radio' },
      options: ['small', 'large'],
    },
    icon: { control: 'boolean' },
    reversed: { control: 'boolean' },
    stacked: { control: 'boolean' },
    onClick: { action: 'onClick' },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
  },
};