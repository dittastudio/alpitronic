import type { StoryContext } from '@storybook/html'
import template from '@/components/progress-bar-circle/progress-bar-circle.html?raw'
import ProgressBarCircle from '@/components/progress-bar-circle/progress-bar-circle'
import { makeResizable } from '@/utils/storybook'
import { wait } from '@/utils/helpers'

export default {
  title: 'Alpitronic/Progress Bar Circle',
  component: 'progress-bar-circle',
  render: (args: { percentage?: number; accentColor?: string; limit?: number }, context: StoryContext) => {
    const { percentage = 56, limit = 80 } = args
    const selectedColor = context.globals.accent ?? '#54e300'
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-resize-container')
    wrapper.innerHTML = template

    document.addEventListener('DOMContentLoaded', async () => {
      const progress = new ProgressBarCircle({
        percentage: 0,
        limit: limit,
        selector: '[data-js-progress]',
      })

      await wait(250)
      await progress.setProgress({ percentage, animate: true })
    })

    wrapper.style.setProperty('--color-accent', selectedColor)

    return makeResizable(wrapper, { width: 400, height: 400 })
  },
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress percentage from 0 to 100',
    },
    limit: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Number for the percentage limit display (default: 80)',
    },
  },
  args: {
    percentage: 56,
    limit: 80,
  },
}

export const Default = {}
