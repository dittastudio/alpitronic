interface Widget {
  shadowRoot: ShadowRoot
  props: {
    icon: string
  }
}

declare const widget: Widget

const files = import.meta.glob('../../assets/icon-system/*.svg', {
  import: 'default',
  query: '?raw',
  eager: true,
}) as Record<string, { default: string }>

const icons = Object.fromEntries(
  Object.entries(files).map(([path, module]) => {
    const fileName = path.split('/').pop() ?? path
    const key = fileName.replace(/\.svg$/i, '')

    return [key, module as unknown as string]
  })
) as Record<string, string>

const icon = widget.shadowRoot.querySelector('[data-mxm-icon-system]')
const selected = icons[widget.props.icon as keyof typeof icons]

if (icon && selected) {
  icon.innerHTML = selected
}
