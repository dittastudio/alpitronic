import '@/components/system-message/system-message.css';
import template from '@/components/system-message/system-message.html?raw';

export default {
  title: 'Alpitronic/System Message',
  tags: ['autodocs'],
  render: ({ type }: { type?: 'success' | 'error' }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const alert = wrapper.firstChild as HTMLElement;

    // if (type === 'success') {
    //   alert.classList.add('alert--success');
    // } else {
    //   alert.classList.add('alert--error');
    // }

    return alert;
  },
  argTypes: {
    type: { control: 'radio', options: ['success', 'error'] },
  },
  args: {
    type: 'success',
  },
};

export const Default = {
  args: {},
};
