import { makeResizable } from '@/utils/storybook'
import template from '@/components/mxm-button/mxm-button.html?raw'

export default {
  title: 'Alpitronic/Mxm Button',
  component: 'mxm-button',
  render: ({ label, icon }: { label?: string; icon?: boolean }) => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-resize-container')
    wrapper.innerHTML = template

    const btn: HTMLElement | null = wrapper.querySelector('button')

    if (!btn) {
      return wrapper
    }

    const btnLabel = btn.querySelector('span')

    if (btnLabel && label) {
      btnLabel.textContent = label
    }

    const svg = btn.querySelector('svg')

    if (svg && icon) {
      svg.classList.remove('hidden')
    }

    return makeResizable(wrapper)
  },
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'boolean' },
  },
  args: {
    label: 'Hello World',
    icon: true,
  },
}

export const Default = {}
