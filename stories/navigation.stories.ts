import '@/css/app.css'
import '@/components/navigation/navigation.css'
import '@/components/button/button.css'
import template from '@/components/navigation/navigation.html?raw'
import buttonTemplate from '@/components/button/button.html?raw'
import { makeDraggable } from '@/utils/draggable'

export default {
  title: 'Alpitronic/Navigation',
  render: (args: any) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template
    const element = wrapper.firstChild as HTMLElement

    const buttonWrapper = document.createElement('div')
    buttonWrapper.innerHTML = buttonTemplate
    const buttonElement = buttonWrapper.querySelector('[data-js-button]')

    const container = element
    const nav = element.querySelector('[data-js-navigation]')
    const navContent = nav?.firstElementChild

    if (nav && navContent && buttonElement) {
      navContent.innerHTML = ''

      Array.from({ length: 4 }, (_, i) => i + 1).forEach(buttonIndex => {
        const btn = buttonElement.cloneNode(true) as HTMLElement
        const label = btn.querySelector('span')

        if (label && args[`button${buttonIndex}Label`]) {
          label.textContent = args[`button${buttonIndex}Label`]
        }

        if (args.backgroundColor) {
          btn.style.backgroundColor = args.backgroundColor
        }

        if (args.textColor) {
          btn.style.color = args.textColor
        }

        if (args.rounded === 'large') {
          btn.classList.remove('rounded-22')
          btn.classList.add('rounded-42')
        }

        if (args.stacked && args.reversed) {
          btn.classList.remove('flex-row-reverse')
          btn.classList.add('flex-col')
          btn.classList.add('flex-col-reverse')
        } else if (args.reversed) {
          btn.classList.add('flex-row-reverse')
        } else if (args.stacked) {
          btn.classList.add('flex-col')
        }

        const svg = btn.querySelector('svg')
        if (svg && args.icon) {
          svg.classList.remove('hidden')
        }

        if (args.showLineGuide) {
          btn.classList.remove('before:hidden')
        }

        navContent.appendChild(btn)
      })

      makeDraggable(nav as HTMLElement, container)
    }

    return element
  },
  argTypes: {
    button1Label: { control: 'text', table: { category: 'Button Labels' } },
    button2Label: { control: 'text', table: { category: 'Button Labels' } },
    button3Label: { control: 'text', table: { category: 'Button Labels' } },
    button4Label: { control: 'text', table: { category: 'Button Labels' } },

    rounded: { control: { type: 'radio' }, options: ['small', 'large'], table: { category: 'Global Styling' } },
    backgroundColor: { control: 'color', table: { category: 'Global Styling' } },
    textColor: { control: 'color', table: { category: 'Global Styling' } },
    icon: { control: 'boolean', table: { category: 'Global Styling' } },
    reversed: { control: 'boolean', table: { category: 'Global Styling' } },
    stacked: { control: 'boolean', table: { category: 'Global Styling' } },
    showLineGuide: { control: 'boolean', table: { category: 'Global Styling' } },
  },
  args: {
    button1Label: 'Button 1',
    button2Label: 'Button 2',
    button3Label: 'Button 3',
    button4Label: 'Button 4',

    rounded: 'small',
    backgroundColor: '',
    textColor: '',
    icon: true,
    reversed: false,
    stacked: false,
    showLineGuide: false,
  },
}

export const Default = {}
