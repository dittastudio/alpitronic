import '@/components/typography/typography.css'
import template from '@/components/typography/typography.html?raw'

export default {
  title: 'Alpitronic/Typography',
  component: 'typography',
  render: ({ label }: { label?: string }) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template

    return wrapper.firstChild
  },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Hello World',
  },
}

export const Default = {}
