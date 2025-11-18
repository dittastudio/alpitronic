import '@/components/system-warning/system-warning.css'
import template from '@/components/system-warning/system-warning.html?raw'

export default {
  title: 'Alpitronic/System Warning',
  component: 'system-warning',
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

    wrapper.classList.add('sb-padded')
    wrapper.innerHTML = template

    const main: HTMLElement | null = wrapper.querySelector('[data-main]')

    if (!main) {
      return wrapper
    }

    const headline = main.querySelector('[data-text-headline]')
    const description = main.querySelector('[data-text-description]')

    if (headline && textHeadline) {
      headline.textContent = textHeadline
    }

    if (description && textDescription) {
      description.textContent = textDescription
    }

    return wrapper
  },
  args: {
    textHeadline: 'Cable cut detected',
    textDescription: 'Authorities have been notified',
  },
}

export const Default = {}
