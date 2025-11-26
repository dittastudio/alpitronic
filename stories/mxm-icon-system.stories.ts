import template from '@/components/mxm-icon-system/mxm-icon-system.html?raw'

const iconModules = import.meta.glob('@/assets/icon-system/*.svg', {
  import: 'default',
  query: '?raw',
  eager: true,
})

const iconNames = Object.keys(iconModules)
  .map(path => {
    const fileName = path.split('/').pop()
    return fileName?.replace('.svg', '') || ''
  })
  .filter(Boolean)
  .sort()

export default {
  title: 'Alpitronic/Mxm Icon System',
  component: 'mxm-icon-system',
  render: ({ icon, color }: { icon?: string; color?: string }) => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('sb-centered')

    const inside = document.createElement('div')

    inside.classList.add('sb-boxed')
    wrapper.appendChild(inside)
    inside.innerHTML = template

    const svgContainer = inside.querySelector('[data-mxm-icon-system]') as HTMLElement | null

    if (svgContainer) {
      if (color) {
        svgContainer.style.color = color
      }

      if (icon) {
        const iconPath = Object.keys(iconModules).find(path => path.includes(`/${icon}.svg`))

        if (iconPath) {
          const svgContent = iconModules[iconPath] as string

          svgContainer.innerHTML = svgContent
        }
      }
    }

    return wrapper
  },
  argTypes: {
    color: {
      control: 'color',
    },
    icon: {
      control: 'inline-radio',
      options: iconNames,
    },
  },
  args: {
    color: '#ffffff',
    icon: 'bolt',
  },
}

export const Default = {}
