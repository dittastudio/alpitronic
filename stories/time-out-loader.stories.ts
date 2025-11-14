import type { StoryContext } from '@storybook/html'
import '@/components/time-out-loader/time-out-loader.css'
import template from '@/components/time-out-loader/time-out-loader.html?raw'
import { initTimeOutLoader } from '@/components/time-out-loader/time-out-loader'

const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Time Out Loader',
  component: 'time-out-loader',
  render: (args: any, context: StoryContext) => {
    const { seconds = 45 } = args
    const storyId = context.id
    let element = storyElements.get(storyId)
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-padded')
    wrapper.innerHTML = template

    if (!element) {
      element = wrapper.firstChild as HTMLElement
      storyElements.set(storyId, element)

      setTimeout(() => {
        storyInitialized.set(storyId, true)
      }, 100)
    }

    // Reset and restart the timer on each render
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
