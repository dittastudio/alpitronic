import '@/components/chart-bar/chart-bar.css'
import template from '@/components/chart-bar/chart-bar.html?raw'
import ChartBar from '@/components/chart-bar/chart-bar'
import { PerlinNoise, randomRange } from '@/utils/storybook'

const perlin = new PerlinNoise(50)

export default {
  title: 'Alpitronic/Chart Bar',
  component: 'chart-bar',
  parameters: {
    docs: {
      description: {
        component: `Can't see the chart? Refresh your browser.`,
      },
    },
  },
  render: ({ data = [], xLabel = [], yLabel = [] }: { data: number[]; xLabel?: string[]; yLabel?: string[] }) => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-padded')
    wrapper.innerHTML = template

    document.addEventListener('DOMContentLoaded', () => {
      new ChartBar({
        data,
        xLabel,
        yLabel,
      })
    })

    return wrapper
  },
  argTypes: {
    data: {
      control: 'inline-radio',
      options: ['perlin', 'range', 'random'],
      mapping: {
        perlin: Array.from({ length: 60 }, (_, i) => (perlin.noise(i * 0.1) + 1) / 2),
        random: Array.from({ length: 60 }, (_, i) => Math.random()),
        range: Array.from({ length: 60 }, (_, i) => (i % 10 ? randomRange(0.7, 0.9) : randomRange(0.1, 0.6))),
      },
    },
    xLabel: {
      control: 'inline-radio',
      options: ['sample1', 'sample2', 'sample3'],
      mapping: {
        sample1: ['1:00', '1:10', '1:20', '1:30', '1:40', '1:50', '2:00', '2:10', '2:20'],
        sample2: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        sample3: ['1min', '2min', '3min', '4min', '5min', '6min', '7min', '8min', '9min'],
      },
    },
    yLabel: {
      control: 'inline-radio',
      options: ['sample1', 'sample2', 'sample3'],
      mapping: {
        sample1: ['400 kW', '200 kW'],
        sample2: ['High', 'Medium', 'Low'],
        sample3: ['100%', '50%', '20%'],
      },
    },
  },
  args: {
    data: 'perlin',
    xLabel: 'sample1',
    yLabel: 'sample1',
  },
}

export const Default = {}
