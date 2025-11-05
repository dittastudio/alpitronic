import '@/components/button/button.css';
import template from '@/components/button/button.html?raw';

export default {
  title: 'Alpitronic/Button',
  tags: ['autodocs'],
  render: ({
    label,
    fullWidth,
    rounded,
    backgroundColor,
    textColor,
    icon,
    reversed,
    stacked,
  }: {
    label?: string;
    fullWidth?: boolean;
    rounded?: 'small' | 'large';
    backgroundColor?: string;
    textColor?: string;
    icon?: boolean;
    reversed?: boolean;
    stacked?: boolean;
  }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const btn: HTMLElement | null = wrapper.querySelector('button');

    if (!btn) {
      return wrapper;
    }

    const btnLabel = btn.querySelector('span');

    if (btnLabel && label) {
      btnLabel.textContent = label;
    }

    if (fullWidth) {
      btn.classList.add('w-full');
    }

    if (backgroundColor) {
      btn.style.backgroundColor = backgroundColor;
    }

    if (textColor) {
      btn.style.color = textColor;
    }

    if (rounded === 'large') {
      btn.classList.remove('rounded-22');
      btn.classList.add('rounded-42');
    }

    if (stacked && reversed) {
      btn.classList.remove('flex-row-reverse');
      btn.classList.add('flex-col');
      btn.classList.add('flex-col-reverse');
    } else if (reversed) {
      btn.classList.add('flex-row-reverse');
    } else if (stacked) {
      btn.classList.add('flex-col');
    }

    const svg = btn.querySelector('svg');

    if (svg && icon) {
      svg.classList.remove('hidden');
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
  },
  args: {
    label: 'Hello World',
    fullWidth: false,
    rounded: 'small',
    icon: true,
    reversed: false,
    stacked: false,
  },
};

export const Default = {
  args: {},
};
