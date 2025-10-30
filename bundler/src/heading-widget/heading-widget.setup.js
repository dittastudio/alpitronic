/**
 * heading-widget.setup.js
 * Setup and configuration logic for Heading Widget
 */

export function setup(config = {}) {
  const defaults = {
    title: 'Welcome to Hyperdesign',
    subtitle: 'Build beautiful, accessible widgets for your design system.',
    centered: false,
    showButtons: true,
    primaryButtonText: 'Get Started',
    secondaryButtonText: 'Learn More'
  };

  return {
    ...defaults,
    ...config
  };
}

export default setup;

