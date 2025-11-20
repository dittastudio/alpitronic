import template from '@/components/time-out-loader/time-out-loader.html?raw'
import { initTimeOutLoader } from '@/components/time-out-loader/time-out-loader'
import { makeResizable } from '@/utils/storybook'

export default {
  title: 'Alpitronic/Time Out Loader',
  component: 'time-out-loader',
  render: (args: any) => {
    const { seconds = 45 } = args
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-resize-container')
    wrapper.innerHTML = template

    const element = wrapper.firstChild as HTMLElement

    initTimeOutLoader(element, seconds)

    return makeResizable(wrapper, { width: 400, height: 400 })
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
