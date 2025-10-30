/**
 * Alert Widget
 * A simple alert component with success/error states
 */

class AlertWidget {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      type: 'success',
      message: 'Your action was completed successfully.',
      ...options
    };
    this.element = null;
  }

  render() {
    if (!this.container) {
      console.error('AlertWidget: No container provided');
      return;
    }

    // Create the widget element
    this.element = this.container.querySelector('.alert-widget');

    if (!this.element) {
      console.error('AlertWidget: Widget element not found in container');
      return;
    }

    // Add event listeners
    const button = this.element.querySelector('button');
    if (button) {
      button.addEventListener('click', () => this.handleClick());
    }

    // Apply type-specific styling
    this.applyType(this.options.type);
  }

  applyType(type) {
    if (type === 'error') {
      this.element.classList.add('alert-widget--error');
      const icon = this.element.querySelector('.alert-widget__icon');
      if (icon) {
        icon.classList.remove('bg-green-500');
        icon.classList.add('bg-red-500');
      }
    }
  }

  handleClick() {
    if (this.options.onClose) {
      this.options.onClose();
    } else {
      this.destroy();
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default AlertWidget;

