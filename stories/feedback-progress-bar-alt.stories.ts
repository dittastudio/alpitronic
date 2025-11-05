import '@/css/app.css'
import '@/components/feedback-progress-bar-alt/feedback-progress-bar-alt.css'
import template from '@/components/feedback-progress-bar-alt/feedback-progress-bar-alt.html?raw'
import { initProgressBar, updateProgress, setBackgroundColor } from '@/components/feedback-progress-bar/feedback-progress-bar'

// Cache the element for the Storybook demo purposes only lolz
let cachedElement: HTMLElement | null = null

export default {
  title: 'Alpitronic/Feedback Progress Bar Alt',
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
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

const renderProgressBar = ({ percentage = 56, backgroundColor = '#54e300' }: { percentage?: number; backgroundColor?: string }) => {
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
      setBackgroundColor(cachedElement?.querySelector('[data-js-percentage-bar]')!, backgroundColor)
    }, 100)
  } else {
    updateProgress(cachedElement, percentage, true)
    setBackgroundColor(cachedElement?.querySelector('[data-js-percentage-bar]')!, backgroundColor)
  }

  return cachedElement
}

export const Primary = {
  args: {
    percentage: 56,
    backgroundColor: '#54e300',
  },
  render: renderProgressBar,
}

export const Secondary = {
  args: {
    percentage: 42,
    backgroundColor: '#371E0A',
  },
  render: renderProgressBar,
}
