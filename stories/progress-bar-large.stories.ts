import type { StoryContext } from '@storybook/html'
import '@/components/progress-bar-large/progress-bar-large.css'
import template from '@/components/progress-bar-large/progress-bar-large.html?raw'
import ProgressBarLarge from '@/components/progress-bar-large/progress-bar-large'
import { wait } from '@/utils/helpers'

const wrappers = new Map<string, HTMLDivElement>()
const progresses = new Map<string, ProgressBarLarge>()

export default {
  title: 'Alpitronic/Progress Bar Large',
  component: 'progress-bar-large',
  render: (args: { percentage?: number; limit?: number }, context: StoryContext) => {
    const { percentage = 56, limit = 80 } = args
    const selectedColor = context.globals.accent ?? '#54e300'

    let wrapper = wrappers.get(context.id)

    if (wrapper) {
      const savedProgress = progresses.get(context.id)

      if (savedProgress) {
        savedProgress.setProgress({ percentage })
        savedProgress.setLimit(limit)
      }
    } else {
      wrapper = document.createElement('div')
      wrapper.classList.add('sb-padded')
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

    wrapper.style.setProperty('--color-accent', selectedColor)

    return wrapper
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100',
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
    darkText: true,
  },
}

export const Default = {}
