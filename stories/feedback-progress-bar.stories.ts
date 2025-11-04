import '@/css/app.css'
import '@/components/feedback-progress-bar/feedback-progress-bar.css'
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw'
import { initProgressBar, updateProgress } from '@/components/feedback-progress-bar/feedback-progress-bar.js'

// Cache the element for the Storybook demo purposes only lolz
let cachedElement: HTMLElement | null = null

export default {
  title: 'Alpitronic/Feedback Progress Bar',
  tags: ['autodocs'],
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100'
    },
  },
}

export const Primary = {
  args: {
    percentage: 56,
  },
  render: ({ percentage = 56 }: { percentage?: number }) => {
    if (!cachedElement) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = template
      cachedElement = wrapper.firstChild as HTMLElement
      initProgressBar(cachedElement, 0)

      const container = cachedElement.querySelector('.container-settings')
      const resizeIndicator = cachedElement.querySelector('[data-resize-indicator]')

      if (container && resizeIndicator) {
        const updateResizeIndicatorPosition = () => {
          const { width, height } = container.getBoundingClientRect();
          (resizeIndicator as HTMLElement).style.left = `${width}px`;
          (resizeIndicator as HTMLElement).style.top = `${height}px`
        }

        updateResizeIndicatorPosition()

        const resizeObserver = new ResizeObserver(updateResizeIndicatorPosition)
        resizeObserver.observe(container)
      }

      setTimeout(() => {
        updateProgress(cachedElement!, percentage, true)
      }, 100)
    } else {
      updateProgress(cachedElement, percentage, true)
    }

    return cachedElement
  },
}
