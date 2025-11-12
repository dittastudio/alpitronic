import '@/components/icon-system/icon-system.css'
import template from '@/components/icon-system/icon-system.html?raw'

const iconModules = (import.meta as any).glob('@/assets/icon-system/*.svg', {
  import: 'default',
  query: '?raw',
  eager: true,
})

const iconNames = Object.keys(iconModules).map((path) => {
  const fileName = path.split('/').pop()
  return fileName?.replace('.svg', '') || ''
}).filter(Boolean).sort()

export default {
  title: 'Alpitronic/Icon System',
  render: ({ icon, color, size }: { icon?: string; color?: string; size?: number }) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = template

    const main: HTMLElement | null = wrapper.querySelector('[data-main]')
    const svgContainer: HTMLElement | null = wrapper.querySelector('[data-svg]')

    if (!main || !svgContainer) {
      return wrapper
    }

    if (color) {
      svgContainer.style.color = color
    }

    if (icon) {
      const iconPath = Object.keys(iconModules).find((path) =>
        path.includes(`/${icon}.svg`)
      )

      if (iconPath) {
        const svgContent = iconModules[iconPath]

        if (svgContainer) {
          svgContainer.innerHTML = svgContent
        }
      }
    }

    return main
  },
  argTypes: {
    color: {
      control: 'color',
    },
    icon: {
      control: 'radio',
      options: iconNames,
    },
  },
  args: {
    color: '#ffffff',
    icon: 'bolt',
  },
}

export const Default = {
  args: {},
}
