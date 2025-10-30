/**
 * Heading Widget
 * A hero/heading component with title, subtitle, and CTAs
 */

class HeadingWidget {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      title: 'Welcome to Hyperdesign',
      subtitle: 'Build beautiful, accessible widgets for your design system.',
      centered: false,
      ...options
    };
    this.element = null;
  }

  render() {
    if (!this.container) {
      console.error('HeadingWidget: No container provided');
      return;
    }

    this.element = this.container.querySelector('.heading-widget');

    if (!this.element) {
      console.error('HeadingWidget: Widget element not found in container');
      return;
    }

    // Apply centered style if needed
    if (this.options.centered) {
      this.element.classList.add('heading-widget--centered');
    }

    // Update content if provided
    if (this.options.title) {
      const titleEl = this.element.querySelector('.heading-widget__title');
      if (titleEl) titleEl.textContent = this.options.title;
    }

    if (this.options.subtitle) {
      const subtitleEl = this.element.querySelector('.heading-widget__subtitle');
      if (subtitleEl) subtitleEl.textContent = this.options.subtitle;
    }

    // Add button event listeners
    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => this.handleButtonClick(index));
    });
  }

  handleButtonClick(index) {
    console.log(`Button ${index} clicked`);
    if (this.options.onButtonClick) {
      this.options.onButtonClick(index);
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default HeadingWidget;

