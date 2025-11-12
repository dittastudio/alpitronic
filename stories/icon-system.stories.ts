import '@/components/icon-system/icon-system.css'
import template from '@/components/icon-system/icon-system.html?raw'

export default {
  title: 'Alpitronic/Icon System',
  render: ({ icon }: { icon?: string }) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template

    const main: HTMLElement | null = wrapper.querySelector('[data-main]')

    if (!main) {
      return wrapper
    }

    if (icon) {
      const iconImg = main.querySelector('img')

      if (iconImg) {
        iconImg.setAttribute('src', `icon-system/${icon}.svg`)
      }
    }

    return wrapper.firstChild
  },
  argTypes: {
    icon: {
      control: 'radio',
      options: [
        '1',
        '2',
        '3',
        '4',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'bolt',
        'card-bolt',
        'credit-card',
        'danger',
        'device',
        'error',
        'globe',
        'hourglass',
        'house',
        'minus',
        'padlock',
        'plug',
        'price',
        'question',
        'reciept',
        'telephone',
        'tick',
        'timer',
        'warning',
      ],
    },
  },
  args: {
    icon: 'bolt',
  },
}

export const Default = {}
