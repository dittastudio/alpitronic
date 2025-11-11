import type { StoryContext } from '@storybook/html'
import '@/components/progress-bar-circle/progress-bar-circle.css'
import template from '@/components/progress-bar-circle/progress-bar-circle.html?raw'
import Progress from '@/components/progress-bar-circle/progress-bar-circle'
// import { setupResizeIndicator } from '@/utils/storybook'
// import { initProgressBar, updateProgress, setStrokeColor, setLimitCount } from '@/utils/progress'
import { wait } from '@/utils/helpers'

const wrappers = new Map<string, HTMLDivElement>()
const progresses = new Map<string, Progress>()

export default {
  title: 'Alpitronic/Progress Bar Circle',
  render: (args: any, context: StoryContext) => {
    const { percentage = 56, backgroundColor = '#54e300', limit = 80 } = args
    let wrapper = wrappers.get(context.id)

    if (wrapper) {
      if (progresses.has(context.id)) {
        progresses.get(context.id)?.setProgress(percentage)
      }
    } else {
      wrapper = document.createElement('div')
      wrapper.classList.add('mt-8', 'mx-8', 'pb-8')
      wrapper.innerHTML = template
      wrappers.set(context.id, wrapper)

      document.addEventListener('DOMContentLoaded', async () => {
        const progress = new Progress({ percentage: 0, selector: '[data-js-progress]' })
        progresses.set(context.id, progress)

        await wait(1000)
        progress.animateTo(percentage)
      })
    }

    return wrapper
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100',
    },
    backgroundColor: {
      control: { type: 'color' },
      description: 'Stroke color of the progress ring',
    },
    limit: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Number for the percentage limit display (default: 80)',
    },
  },
  args: {
    percentage: 56,
    limit: 80,
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
