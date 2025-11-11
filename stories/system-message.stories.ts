import '@/components/system-message/system-message.css'
import template from '@/components/system-message/system-message.html?raw'

export default {
  title: 'Alpitronic/System Message',
  render: ({
    type,
    textHeadline,
    textDescription,
  }: {
    type?: 'success' | 'error'
    textHeadline?: string
    textDescription?: string
  }) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template

    const main: HTMLElement | null = wrapper.querySelector('[data-main]')

    if (!main) {
      return wrapper
    }

    const error = main.querySelector('[data-error]')
    const success = main.querySelector('[data-success]')

    if (error && success) {
      if (type === 'success') {
        error.classList.add('hidden')
        success.classList.remove('hidden')
      } else {
        error.classList.remove('hidden')
        success.classList.add('hidden')
      }
    }

    const headline = main.querySelector('[data-text-headline]')
    const description = main.querySelector('[data-text-description]')

    if (headline && textHeadline) {
      headline.textContent = textHeadline
    }

    if (description && textDescription) {
      description.textContent = textDescription
    }

    return wrapper.firstChild
  },
  argTypes: {
    type: { control: 'radio', options: ['success', 'error'] },
  },
  args: {
    type: 'success',
    textHeadline: 'System Message',
    textDescription: 'Please try again',
  },
}

export const Default = {
  args: {},
}
