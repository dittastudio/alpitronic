import type { StoryContext } from '@storybook/html'
import '@/components/progress-stepped/progress-stepped.css'
import template from '@/components/progress-stepped/progress-stepped.html?raw'
import ProgressStepped from '@/components/progress-stepped/progress-stepped'
// import { wait } from '@/utils/helpers'

const wrappers = new Map<string, HTMLDivElement>()
const progresses = new Map<string, ProgressStepped>()

export default {
  title: 'Alpitronic/Progress Stepped',
  render: (args: { step?: number }, context: StoryContext) => {
    const { step = 0 } = args
    const selectedColor = context.globals.accent ?? '#54e300'

    let wrapper = wrappers.get(context.id)

    if (wrapper) {
      const savedProgress = progresses.get(context.id)

      if (savedProgress) {
        savedProgress.setStep(step)
      }
    } else {
      wrapper = document.createElement('div')
      wrapper.classList.add('mt-8', 'mx-8', 'pb-8')
      wrapper.innerHTML = template
      wrappers.set(context.id, wrapper)

      // document.addEventListener('DOMContentLoaded', async () => {
      //   const progress = new ProgressStepped({
      //     steps: ['Initialising', 'Ready', 'Preparing'],
      //     selector: '[data-js-progress]',
      //   })

      //   progresses.set(context.id, progress)

      //   await wait(250)
      //   await progress.setStep(0)
      // })
    }

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
