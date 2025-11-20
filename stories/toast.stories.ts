import template from '@/components/toast/toast.html?raw'
import { makeResizable } from '@/utils/storybook'

const themeClasses = {
  dark: ['bg-grey-800', 'text-white'],
  light: ['bg-white', 'text-grey-800'],
  warning: ['bg-warning', 'text-white'],
}

export default {
  title: 'Alpitronic/Toast',
  component: 'toast',
  render: (args: any) => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-resize-container')
    wrapper.innerHTML = template

    const element = wrapper.firstChild as HTMLElement
    const label = element.querySelector('[data-js-toast-label]')

    if (label) {
      label.textContent = args.label
    }

    if (element) {
      const allThemeClasses = Object.values(themeClasses).flat()
      element.classList.remove(...allThemeClasses)
      element.classList.add(...themeClasses[args.theme as keyof typeof themeClasses])
    }

    return makeResizable(wrapper, { width: 300, height: 66 })
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
      control: 'inline-radio',
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
