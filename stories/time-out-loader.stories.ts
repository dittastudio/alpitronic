import type { StoryContext } from '@storybook/html'
import '@/components/time-out-loader/time-out-loader.css'
import template from '@/components/time-out-loader/time-out-loader.html?raw'
import { setupResizeIndicator } from '@/utils/storybook'
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

    if (!element) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = template
      element = wrapper.firstChild as HTMLElement
      storyElements.set(storyId, element)

      setupResizeIndicator(element)

      setTimeout(() => {
        storyInitialized.set(storyId, true)
      }, 100)
    }

    // Reset and restart the timer on each render
    initTimeOutLoader(element, seconds)

    return element
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
