import '@/css/app.css';
import '@/components/alert/alert.css';
import template from '@/components/alert/alert.html?raw';

export default {
  title: 'Alpitronic/Alert',
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
