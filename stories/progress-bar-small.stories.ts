import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/progress-bar-small/progress-bar-small.css'
import template from '@/components/progress-bar-small/progress-bar-small.html?raw'
import { setupResizeIndicator } from '@/utils/storybook'
import { initProgressBar, updateProgress, setBackgroundColor, setLinesCount } from '@/utils/progress'

// Store for maintaining element state across re-renders
const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Progress Bar Small',
  tags: ['autodocs'],
  render: (args: any, context: StoryContext) => {
    const { percentage = 56, backgroundColor = '#54e300', linesCount = 80 } = args
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
        setBackgroundColor(element!.querySelector('[data-js-percentage-bar]'), backgroundColor)
        setLinesCount(element!, linesCount)
        storyInitialized.set(storyId, true)
      }, 100)
    } else if (isInitialized) {
      // Update existing element
      updateProgress(element, percentage, true)
      setBackgroundColor(element.querySelector('[data-js-percentage-bar]'), backgroundColor)
      setLinesCount(element, linesCount)
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
      description: 'Background color of the progress bar'
    },
    linesCount: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Number for the percentage limit display (default: 80)'
    },
  },
}

export const Primary = {
  args: {
    percentage: 56,
    linesCount: 80,
    backgroundColor: '#54e300',
  },
}

export const Secondary = {
  args: {
    percentage: 42,
    linesCount: 80,
    backgroundColor: '#371E0A',
  },
}
