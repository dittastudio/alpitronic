import { fn } from 'storybook/test';
import '@/css/app.css';
import '@/components/chart-bar/chart-bar.css';
import '@/components/chart-bar/chart-bar.ts';
import template from '@/components/chart-bar/chart-bar.html?raw';

export default {
  title: 'Alpitronic/chart-bar',
  tags: ['autodocs'],
  render: ({ label = 'chart-bar', onClick }: { label?: string; onClick?: () => void }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const chartBar: HTMLElement | null = wrapper.querySelector('.chart-bar');

    if (!chartBar) {
      return wrapper;
    }

    chartBar.classList.add('min-h-64', 'resize');

    return wrapper.firstChild;
  },
  argTypes: {
    label: { control: 'text' },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {},
};
