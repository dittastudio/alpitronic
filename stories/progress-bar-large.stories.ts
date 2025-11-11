import type { StoryContext } from '@storybook/html'
import '@/components/progress-bar-large/progress-bar-large.css'
import template from '@/components/progress-bar-large/progress-bar-large.html?raw'
import { setupResizeIndicator } from '@/utils/storybook'
import { initProgressBar, updateProgress, setBackgroundColor, setTextColor, setLimitCount } from '@/utils/progress'

// Store for maintaining element state across re-renders
const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Progress Bar Large',
  render: (args: any, context: StoryContext) => {
    const { percentage = 56, backgroundColor = '#54e300', darkText = true, limit = 80 } = args
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

      // Delay initial update
      setTimeout(() => {
        updateProgress(element!, percentage, true)
        setBackgroundColor(element!.querySelector('[data-js-progress-bar]'), backgroundColor)
        setTextColor(element!.querySelector('[data-js-progress-bar]'), darkText)
        setLimitCount(element!, limit)
        storyInitialized.set(storyId, true)
      }, 100)
    } else if (isInitialized) {
      // Update existing element
      updateProgress(element, percentage, false)
      setBackgroundColor(element.querySelector('[data-js-progress-bar]'), backgroundColor)
      setTextColor(element.querySelector('[data-js-progress-bar]'), darkText)
      setLimitCount(element, limit)
    }

    return element
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Background color of the progress bar',
    },
    darkText: {
      control: { type: 'boolean' },
      description: 'Toggle between dark (true) and light (false) text color',
    },
    limit: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Number of vertical lines to display (default: 80)',
    },
  },
  args: {
    percentage: 56,
    limit: 80,
    backgroundColor: '#54e300',
    darkText: true,
  },
}

export const Default = {}

export const Branded = {
  args: {
    percentage: 42,
    limit: 80,
    backgroundColor: '#371E0A',
    darkText: false,
  },
}
