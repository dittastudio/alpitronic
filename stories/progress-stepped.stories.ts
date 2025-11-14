import type { StoryContext } from '@storybook/html'
import '@/components/progress-stepped/progress-stepped.css'
import template from '@/components/progress-stepped/progress-stepped.html?raw'
import ProgressStepped from '@/components/progress-stepped/progress-stepped'

const wrappers = new Map<string, HTMLDivElement>()
const progresses = new Map<string, ProgressStepped>()

export default {
  title: 'Alpitronic/Progress Stepped',
  component: 'progress-stepped',
  render: (args: { steps?: string[]; step?: number }, context: StoryContext) => {
    const { steps = [], step = 1 } = args
    const selectedColor = context.globals.accent ?? '#54e300'

    let wrapper = wrappers.get(context.id)

    if (wrapper) {
      const savedProgress = progresses.get(context.id)

      if (savedProgress) {
        savedProgress.setSteps(steps)
        savedProgress.setStep(step)
      }
    } else {
      wrapper = document.createElement('div')
      wrapper.classList.add('sb-padded')
      wrapper.innerHTML = template
      wrappers.set(context.id, wrapper)

      document.addEventListener('DOMContentLoaded', async () => {
        const progress = new ProgressStepped({
          steps,
          step,
          selector: '[data-js-progress]',
        })

        progresses.set(context.id, progress)
      })
    }

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
