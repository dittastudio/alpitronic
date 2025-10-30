/**
 * alert-widget.setup.js
 * Setup and configuration logic for Alert Widget
 */

export function setup(config = {}) {
  const defaults = {
    type: 'success',
    message: 'Your action was completed successfully.',
    autoClose: false,
    autoCloseDelay: 3000,
    showButton: true,
    buttonText: 'Continue'
  };

  return {
    ...defaults,
    ...config
  };
}

export default setup;

