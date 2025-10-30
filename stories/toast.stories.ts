import '@/css/app.css';
import '@/components/toast/toast.css';
import template from '@/components/toast/toast.html?raw';
import { initToaster } from '@/components/toast/toast.js';

export default {
  title: 'Alpitronic/toast',
  tags: ['autodocs'],
  render: ({

    }) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    // Initialize the toaster functionality after rendering
    setTimeout(() => {
      const cleanup = initToaster();

      // Store cleanup function for Storybook to call when story unmounts
      if (wrapper.firstChild && typeof (wrapper.firstChild as any).__cleanup === 'undefined') {
        (wrapper.firstChild as any).__cleanup = cleanup;
      }
    }, 0);

    return wrapper.firstChild;
  },
  argTypes: {

  },
};

export const Default = {
  args: {

  },
};