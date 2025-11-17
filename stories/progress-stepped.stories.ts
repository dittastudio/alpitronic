import type { StoryContext } from '@storybook/html'
import template from '@/components/progress-stepped/progress-stepped.html?raw'
import ProgressStepped from '@/components/progress-stepped/progress-stepped'

export default {
  title: 'Alpitronic/Progress Stepped',
  component: 'progress-stepped',
  render: (args: { steps?: string[]; step?: number }, context: StoryContext) => {
    const { steps = [], step = 1 } = args
    const selectedColor = context.globals.accent ?? '#54e300'

    const wrapper = document.createElement('div')
    wrapper.classList.add('sb-padded')
    wrapper.innerHTML = template

    document.addEventListener('DOMContentLoaded', async () => {
      new ProgressStepped({
        steps,
        step,
        selector: '[data-js-progress]',
      })
    })

    wrapper.style.setProperty('--color-accent', selectedColor)

    return wrapper
  },
  argTypes: {
    steps: { control: 'array', description: 'Array of step labels' },
    step: { control: 'number', description: 'Current progress step' },
  },
  args: {
    steps: ['Initialising', 'Ready', 'Preparing'],
    step: 1,
  },
}

export const Default = {}
