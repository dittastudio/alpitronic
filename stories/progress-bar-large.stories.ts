import type { StoryContext } from '@storybook/html'
import '@/components/progress-bar-large/progress-bar-large.css'
import template from '@/components/progress-bar-large/progress-bar-large.html?raw'
import ProgressBarLarge from '@/components/progress-bar-large/progress-bar-large'
import { wait } from '@/utils/helpers'

const wrappers = new Map<string, HTMLDivElement>()
const progresses = new Map<string, ProgressBarLarge>()

export default {
  title: 'Alpitronic/Progress Bar Large',
  render: (args: { percentage?: number; accentColor?: string; limit?: number }, context: StoryContext) => {
    const { percentage = 56, accentColor = '#54e300', limit = 80 } = args
    let wrapper = wrappers.get(context.id)

    if (wrapper) {
      const savedProgress = progresses.get(context.id)

      if (savedProgress) {
        savedProgress.setProgress({ percentage })
        savedProgress.setLimit(limit)
      }
    } else {
      wrapper = document.createElement('div')
      wrapper.classList.add('mt-8', 'mx-8', 'pb-8')
      wrapper.innerHTML = template
      wrappers.set(context.id, wrapper)

      document.addEventListener('DOMContentLoaded', async () => {
        const progress = new ProgressBarLarge({
          percentage: 0,
          limit: limit,
          selector: '[data-js-progress]',
        })

        progresses.set(context.id, progress)

        await wait(250)
        await progress.setProgress({ percentage, animate: true })
      })
    }

    return wrapper
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100',
    },
    accentColor: {
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
    accentColor: '#54e300',
    darkText: true,
  },
}

export const Default = {}

export const Branded = {
  args: {
    percentage: 42,
    limit: 80,
    accentColor: '#371E0A',
    darkText: false,
  },
}
