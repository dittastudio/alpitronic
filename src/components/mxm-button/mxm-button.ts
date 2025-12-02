interface Widget {
  shadowRoot: ShadowRoot
  props: {
    text: string
    icon: string
  }
}

declare const widget: Widget

const content = widget.shadowRoot.querySelector('[data-mxm-button-content]')

if (content) {
  content.textContent = widget.props.text
}

const icon = widget.shadowRoot.querySelector('[data-mxm-button-icon]')
let iconComponent = widget.shadowRoot.querySelector('a-mxm-icon-system')

if (icon && widget.props.icon && widget.props.icon !== 'None') {
  if (!iconComponent) {
    iconComponent = document.createElement('a-mxm-icon-system')
    icon.appendChild(iconComponent)
  }

  icon.classList.remove('mxm-button__icon--hidden')

  utils.dom.attrs(iconComponent, {
    icon: widget.props.icon,
    box: {
      width: '28px',
      height: '28px',
    },
  })
} else if (icon && widget.props.icon === 'None') {
  icon.classList.add('mxm-button__icon--hidden')

  if (iconComponent) {
    iconComponent.remove()
    iconComponent = null
  }
}
