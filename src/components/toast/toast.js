/**
 * Toast Notification System
 * Creates and manages toast notifications with stacking animations
 */

const DEFAULT_CONFIG = {
  label: 'Message placeholder',
  autoDismiss: false,
  dismissDelay: 5000,
  maxToasts: 3,
};

export function initToaster(config = {}) {
  const options = { ...DEFAULT_CONFIG, ...config };
  const toaster = document.getElementById('toaster');
  const addToastBtn = document.getElementById('addToastBtn');
  let toastCounter = 0; // Counter for cycling modifier classes

  if (!toaster) {
    console.warn('Toaster container not found');
    return () => {};
  }

  /**
   * Creates a toast element with animation
   */
  function createToastElement({ label, modifierClass = '' }) {
    const toast = document.createElement('div');
    toast.className = modifierClass ? `toast ${modifierClass}` : 'toast';
    toast.setAttribute('data-mounted', 'false');

    toast.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0003 5.33341C10.1093 5.33341 5.33366 10.109 5.33366 16.0001C5.33366 21.8911 10.1093 26.6667 16.0003 26.6667C21.8914 26.6667 26.667 21.8911 26.667 16.0001C26.667 10.109 21.8914 5.33341 16.0003 5.33341ZM2.66699 16.0001C2.66699 8.63628 8.63653 2.66675 16.0003 2.66675C23.3641 2.66675 29.3337 8.63628 29.3337 16.0001C29.3337 23.3638 23.3641 29.3334 16.0003 29.3334C8.63653 29.3334 2.66699 23.3638 2.66699 16.0001Z" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3337 9.33325V18.6666H14.667V9.33325H17.3337Z" />
        <path d="M14.667 20H17.3337V22.6667H14.667V20Z" />
      </svg>
      <span class="toast__label">${label}</span>
    `;

    return toast;
  }

  /**
   * Triggers the mount animation
   */
  function triggerMountAnimation(toast) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.setAttribute('data-mounted', 'true');
      });
    });
  }

  /**
   * Updates all toast positions based on their order
   * Most recent toast gets index 0 (bottom position)
   */
  function updateToastPositions() {
    const toasts = Array.from(toaster.querySelectorAll('.toast'));
    const totalToasts = toasts.length;

    toasts.forEach((toast, i) => {
      const index = totalToasts - i - 1;
      toast.style.setProperty('--index', index);
    });
  }

  /**
   * Removes a toast with animation
   */
  function removeToast(toast) {
    toast.setAttribute('data-mounted', 'false');
    toast.classList.add('toast--removing');

    setTimeout(() => {
      toast.remove();
      updateToastPositions();
    }, 400); // Match CSS transition duration
  }

  /**
   * Adds a new toast notification
   */
  function addToast(customOptions = {}) {
    const toastOptions = { ...options, ...customOptions };

    // Remove oldest toast if we've reached the limit
    // Only count toasts that aren't already being removed
    const existingToasts = Array.from(toaster.querySelectorAll('.toast')).filter(
      toast => !toast.classList.contains('toast--removing')
    );
    if (existingToasts.length >= toastOptions.maxToasts) {
      const oldestToast = existingToasts[0];
      removeToast(oldestToast);
    }

    // Determine modifier class based on counter
    const modifierClasses = ['', 'toast--dark', 'toast--alert'];
    const modifierClass = modifierClasses[toastCounter % 3];
    toastCounter++;

    const toast = createToastElement({ ...toastOptions, modifierClass });

    toast.style.setProperty('--index', '0');
    toaster.appendChild(toast);

    triggerMountAnimation(toast);
    updateToastPositions();

    // Auto-dismiss if configured
    if (toastOptions.autoDismiss) {
      setTimeout(() => removeToast(toast), toastOptions.dismissDelay);
    }

    return toast;
  }

  // Attach click handler if button exists
  if (addToastBtn) {
    addToastBtn.addEventListener('click', () => addToast());
  }

  // Cleanup function for proper memory management
  return () => {
    if (addToastBtn) {
      addToastBtn.removeEventListener('click', addToast);
    }
  };
}

// Auto-initialize when used as a standalone script
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  initToaster();
} else if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initToaster());
}

