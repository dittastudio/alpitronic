import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/feedback-progress-bar/feedback-progress-bar.css'
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw'
import { initProgressBar, updateProgress, setBackgroundColor, setTextColor } from '@/components/feedback-progress-bar/feedback-progress-bar'

// Store for maintaining element state across re-renders
const storyElements = new Map<string, HTMLElement>()
const storyInitialized = new Map<string, boolean>()

export default {
  title: 'Alpitronic/Feedback Progress Bar',
  tags: ['autodocs'],
  render: (args: any, context: StoryContext) => {
    const { percentage = 56, backgroundColor = '#54e300', darkText = true } = args
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
        setTextColor(element!.querySelector('[data-js-percentage-bar]'), darkText)
        storyInitialized.set(storyId, true)
      }, 100)
    } else if (isInitialized) {
      // Update existing element
      updateProgress(element, percentage, true)
      setBackgroundColor(element.querySelector('[data-js-percentage-bar]'), backgroundColor)
      setTextColor(element.querySelector('[data-js-percentage-bar]'), darkText)
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
    darkText: {
      control: { type: 'boolean' },
      description: 'Toggle between dark (true) and light (false) text color'
    },
  },
}

export const Primary = {
  args: {
    percentage: 56,
    backgroundColor: '#54e300',
    darkText: true,
  },
}

export const Secondary = {
  args: {
    percentage: 42,
    backgroundColor: '#371E0A',
    darkText: false,
  },
}
