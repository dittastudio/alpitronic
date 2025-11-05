import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/progress-bar-circle/progress-bar-circle.css'
import template from '@/components/progress-bar-circle/progress-bar-circle.html?raw'
import { initProgressBar, updateProgress, setBackgroundColor, setLinesCount } from '@/components/progress-bar-large/progress-bar-large'

// Store for maintaining element state across re-renders
const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Progress Bar Circle',
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

      const container = element.querySelector('.container-settings')
      const resizeIndicator = element.querySelector('[data-resize-indicator]')

      if (container && resizeIndicator) {
        const updateResizeIndicatorPosition = () => {
          const { width, height } = container.getBoundingClientRect();
          (resizeIndicator as HTMLElement).style.left = `${width}px`;
          (resizeIndicator as HTMLElement).style.top = `${height}px`
        }

        const resizeObserver = new ResizeObserver(updateResizeIndicatorPosition)
        resizeObserver.observe(container)

        // Initial position update
        requestAnimationFrame(() => {
          updateResizeIndicatorPosition()
        })
      }

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
    backgroundColor: '#54e300',
    linesCount: 80,
  },
}

export const Secondary = {
  args: {
    percentage: 42,
    backgroundColor: '#371E0A',
    linesCount: 80,
  },
}
