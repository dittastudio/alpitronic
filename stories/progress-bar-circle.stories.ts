import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/progress-bar-circle/progress-bar-circle.css'
import template from '@/components/progress-bar-circle/progress-bar-circle.html?raw'
import { setupResizeIndicator } from '@/utils/storybook'
import { initProgressBar, updateProgress, setStrokeColor } from '@/utils/progress'

const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Progress Bar Circle',
  tags: ['autodocs'],
  render: (args: any, context: StoryContext) => {
    const { percentage = 56, backgroundColor = '#54e300' } = args
    const storyId = context.id
    let element = storyElements.get(storyId)
    const isInitialized = storyInitialized.get(storyId)

    if (!element) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = template
      element = wrapper.firstChild as HTMLElement
      storyElements.set(storyId, element)

      setupResizeIndicator(element)

      initProgressBar(element, 0)

      setTimeout(() => {
        updateProgress(element!, percentage, true)
        setStrokeColor(element!.querySelector('[data-js-progress-ring]'), backgroundColor)
        storyInitialized.set(storyId, true)
      }, 100)
    } else if (isInitialized) {
      updateProgress(element, percentage, true)
      setStrokeColor(element!.querySelector('[data-js-progress-ring]'), backgroundColor)
    }

    return element
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100'
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Stroke color of the progress ring'
    },
  },
  args: {
    percentage: 56,
    backgroundColor: '#54e300',
  },
}

export const Default = {}

export const Branded = {
  args: {
    percentage: 42,
    backgroundColor: '#371E0A',
  },
}
