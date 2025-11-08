import '@/css/app.css'
import '@/components/toast/toast.css'
import template from '@/components/toast/toast.html?raw'

const themeClasses = {
  dark: ['bg-grey-800', 'text-white'],
  light: ['bg-white', 'text-grey-800'],
  warning: ['bg-warning', 'text-white'],
}

export default {
  title: 'Alpitronic/Toast',
  tags: ['autodocs'],
  render: (args: any) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template
    const element = wrapper.firstChild as HTMLElement

    const labelElement = element.querySelector('[data-js-toast-label]')
    if (labelElement) labelElement.textContent = args.label

    const toastElement = element.querySelector('[data-js-toast]')
    if (toastElement) {
      const allThemeClasses = Object.values(themeClasses).flat()
      toastElement.classList.remove(...allThemeClasses)
      toastElement.classList.add(...themeClasses[args.theme as keyof typeof themeClasses])
    }

    return element
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The message text displayed in the toast notification',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Message placeholder' },
      },
    },
    theme: {
      control: 'select',
      options: ['dark', 'light', 'warning'],
      description: 'The theme of the toast',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'dark' },
      },
    },
  },
  args: {
    label: 'Message placeholder',
    theme: 'dark',
  },
}

export const Default = {}
