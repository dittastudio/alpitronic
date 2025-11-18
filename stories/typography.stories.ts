import template from '@/components/typography/typography.html?raw'

export default {
  title: 'Alpitronic/Typography',
  component: 'typography',
  render: () => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-padded')
    wrapper.innerHTML = template

    return wrapper
  },
}

export const Default = {}
