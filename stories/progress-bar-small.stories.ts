import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/progress-bar-small/progress-bar-small.css'
import template from '@/components/progress-bar-small/progress-bar-small.html?raw'
import { initProgressBar, updateProgress, setBackgroundColor } from '@/components/progress-bar-large/progress-bar-large'

// Store for maintaining element state across re-renders
const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Progress Bar Small',
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
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
        storyInitialized.set(storyId, true)
      }, 100)
    } else if (isInitialized) {
      // Update existing element
      updateProgress(element, percentage, true)
      setBackgroundColor(element.querySelector('[data-js-percentage-bar]'), backgroundColor)
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
  },
}

export const Primary = {
  args: {
    percentage: 56,
    backgroundColor: '#54e300',
  },
}

export const Secondary = {
  args: {
    percentage: 42,
    backgroundColor: '#371E0A',
  },
}
