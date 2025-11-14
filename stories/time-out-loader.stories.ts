import '@/components/time-out-loader/time-out-loader.css'
import template from '@/components/time-out-loader/time-out-loader.html?raw'
import { initTimeOutLoader } from '@/components/time-out-loader/time-out-loader'

export default {
  title: 'Alpitronic/Time Out Loader',
  component: 'time-out-loader',
  render: (args: any) => {
    const { seconds = 45 } = args
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-centered')

    const inside = document.createElement('div')

    inside.classList.add('sb-boxed')
    wrapper.appendChild(inside)
    inside.innerHTML = template

    const element = inside.firstChild as HTMLElement

    initTimeOutLoader(element, seconds)

    return wrapper
  },
  argTypes: {
    seconds: {
      control: { type: 'range', min: 5, max: 120, step: 5 },
      description: 'Timeout duration in seconds',
    },
  },
  args: {
    seconds: 30,
  },
}

export const Default = {}
