import type { StoryFn, StoryContext } from '@storybook/html'
import '@/components/progress-stepped/progress-stepped.css'
import template from '@/components/progress-stepped/progress-stepped.html?raw'

export default {
  title: 'Alpitronic/Progress Stepped',
  component: 'progress-stepped',
  render: (args: { step?: number }, context: StoryContext) => {
    const { step = 0 } = args
    const selectedColor = context.globals.accent ?? '#54e300'

    const wrapper = document.createElement('div')
    wrapper.innerHTML = template

    wrapper.style.setProperty('--color-accent', selectedColor)

    return wrapper
  },
  argTypes: {
    steps: { control: 'array', description: 'Array of step labels' },
    step: {
      control: { type: 'range', min: 0, max: 2, step: 1 },
      description: 'Current progress step from 0 to 2',
    },
  },
  args: {
    steps: ['Initialising', 'Ready', 'Preparing'],
    step: 0,
  },
}

export const Default = {}
