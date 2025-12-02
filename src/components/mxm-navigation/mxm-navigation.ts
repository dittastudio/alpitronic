interface Widget {
  shadowRoot: ShadowRoot
  props: {
    button1Enabled: boolean
    button1: {
      text: string
      icon: string
    }
    button2Enabled: boolean
    button2: {
      text: string
      icon: string
    }
    button3Enabled: boolean
    button3: {
      text: string
      icon: string
    }
    button4Enabled: boolean
    button4: {
      text: string
      icon: string
    }
    widgetId: string
  }
}

declare const widget: Widget

type Button = {
  index: 0 | 1 | 2 | 3
  enabled: boolean
  icon: string
  text: string
}

const MAX_BUTTONS = 4

const buttons: Button[] = [
  { index: 0, ...widget.props.button1, enabled: widget.props.button1Enabled },
  { index: 1, ...widget.props.button2, enabled: widget.props.button2Enabled },
  { index: 2, ...widget.props.button3, enabled: widget.props.button3Enabled },
  { index: 3, ...widget.props.button4, enabled: widget.props.button4Enabled },
]

const buttonsContainer = widget.shadowRoot.querySelector('[data-mxm-navigation-buttons]')

// Create max 4 buttons: if a button exists for a given index, create it, otherwise create an empty div.
for (let i = 0; i < MAX_BUTTONS; i++) {
  const btnSlotId = `${widget.props.widgetId}_a-button_${i}`
  const existing = widget.shadowRoot.querySelector(`[button-slot-id="${btnSlotId}"]`)
  const button = buttons.find(button => button.index === i && button.enabled)

  let child = (existing || utils.create(button ? 'a-mxm-button' : 'div')) as HTMLElement

  // Replace existing element if needed, otherwise add the new element to the DOM.
  if (existing) {
    const expectedElement = button ? 'a-mxm-button' : 'div'

    if (expectedElement !== existing.tagName.toLowerCase()) {
      const newChild = utils.create(expectedElement) as HTMLElement
      child.replaceWith(newChild)
      child = newChild
    }
  } else if (buttonsContainer) {
    buttonsContainer.appendChild(child)
  }

  child.setAttribute('button-slot-id', btnSlotId)

  if (button) {
    utils.dom.attrs(child, {
      text: button.text,
      icon: button.icon,
      ledIndex: button.index,
      box: {
        width: 'auto',
        height: '100%',
      },
    })
  }
}

// Handle keydown of 0..3 keys
function keyDownHandler(event: KeyboardEvent) {
  if (event.key >= '0' && event.key <= '3') {
    const button = buttons.find(button => button.index === parseInt(event.key))

    if (button && button.enabled) {
      api.event.emit(`btn${button.index}_pressed`, null)
    }
  }
}

if (utils.dom.inView(widget)) {
  document.addEventListener('keydown', keyDownHandler)

  // @ts-ignore
  // return () => {
  //   document.removeEventListener('keydown', keyDownHandler)
  // }
}
