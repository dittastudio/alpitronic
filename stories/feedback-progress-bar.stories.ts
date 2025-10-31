import '@/css/app.css';
import '@/components/feedback-progress-bar/feedback-progress-bar.css';
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw';

export default {
  title: 'Alpitronic/feedback-progress-bar',
  tags: ['autodocs'],
  render: ({ type = 'success' }: { type?: 'success' | 'error' }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const alert: HTMLElement | null = wrapper.querySelector('.alert');

    if (!alert) {
      return wrapper;
    }

    if (type === 'success') {
      alert.classList.add('alert--success');
    } else {
      alert.classList.add('alert--error');
    }

    return wrapper.firstChild;
  },
  argTypes: {
    type: { control: 'radio', options: ['success', 'error'] },
  },
};

export const Default = {
  args: {},
};
