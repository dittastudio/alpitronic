interface Widget {
  shadowRoot: ShadowRoot
  props: {
    text: string
  }
}

declare const widget: Widget

const content = widget.shadowRoot.querySelector('[data-js-button-content]')

if (content) {
  content.textContent = widget.props.text
}
