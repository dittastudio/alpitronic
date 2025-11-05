import '@/css/app.css'
import '@/components/feedback-progress-bar/feedback-progress-bar.css'
import template from '@/components/feedback-progress-bar/feedback-progress-bar.html?raw'
import { initProgressBar, updateProgress, setBackgroundColor, setTextColor } from '@/components/feedback-progress-bar/feedback-progress-bar'

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

const renderProgressBar = ({ percentage = 56, backgroundColor = '#54e300', darkText = true }: { percentage?: number; backgroundColor?: string; darkText?: boolean }) => {
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
      setTextColor(cachedElement?.querySelector('[data-js-percentage-bar]')!, darkText)
    }, 100)
  } else {
    updateProgress(cachedElement, percentage, true)
    setBackgroundColor(cachedElement?.querySelector('[data-js-percentage-bar]')!, backgroundColor)
    setTextColor(cachedElement?.querySelector('[data-js-percentage-bar]')!, darkText)
  }

  return cachedElement
}

export const Primary = {
  args: {
    percentage: 56,
    backgroundColor: '#54e300',
    darkText: true,
  },
  render: renderProgressBar,
}

export const Secondary = {
  args: {
    percentage: 80,
    backgroundColor: '#2C2C2C',
    darkText: false,
  },
  render: renderProgressBar,
}
