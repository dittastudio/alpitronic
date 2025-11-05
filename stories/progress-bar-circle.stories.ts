import type { StoryContext } from '@storybook/html'
import '@/css/app.css'
import '@/components/progress-bar-circle/progress-bar-circle.css'
import template from '@/components/progress-bar-circle/progress-bar-circle.html?raw'
import { setCircleProgress } from '@/components/progress-bar-large/progress-bar-large'

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

      const container = element.querySelector('.container-settings')
      const resizeIndicator = element.querySelector('[data-resize-indicator]')
      const progressRing = element.querySelector<SVGCircleElement>('[data-js-progress-ring]')

      if (container && resizeIndicator) {
        const updateResizeIndicatorPosition = () => {
          const { width, height } = container.getBoundingClientRect();
          (resizeIndicator as HTMLElement).style.left = `${width}px`;
          (resizeIndicator as HTMLElement).style.top = `${height}px`
        }

        const resizeObserver = new ResizeObserver(updateResizeIndicatorPosition)
        resizeObserver.observe(container)

        requestAnimationFrame(() => {
          updateResizeIndicatorPosition()
        })
      }

      if (progressRing) {
        setCircleProgress(progressRing, 0)

        progressRing.style.stroke = backgroundColor

        setTimeout(() => {
          setCircleProgress(progressRing, percentage)
          storyInitialized.set(storyId, true)
        }, 100)
      }
    } else if (isInitialized) {
      const progressRing = element.querySelector<SVGCircleElement>('[data-js-progress-ring]')
      if (progressRing) {
        setCircleProgress(progressRing, percentage)
        progressRing.style.stroke = backgroundColor
      }
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
