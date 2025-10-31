import type { Meta, StoryObj } from '@storybook/html';
import '@/css/app.css';
import '@/components/toast/toast.css';
import template from '@/components/toast/toast.html?raw';

/**
 * Toast Configuration Interface
 */
interface ToastConfig {
  label?: string;
  autoDismiss?: boolean;
  dismissDelay?: number;
  maxToasts?: number;
}

interface ToastOptions extends ToastConfig {
  modifierClass?: string;
}

const DEFAULT_CONFIG: Required<ToastConfig> = {
  label: 'Message placeholder',
  autoDismiss: false,
  dismissDelay: 5000,
  maxToasts: 3,
};

/**
 * Toast Notification System
 * Creates and manages toast notifications with stacking animations
 */
function initToaster(
  config: ToastConfig = {}
): { cleanup: () => void; addToast: (options?: ToastConfig) => HTMLDivElement | null } {
  const options = { ...DEFAULT_CONFIG, ...config };
  const toaster = document.getElementById('toaster');
  const addToastBtn = document.getElementById('addToastBtn');
  let toastCounter = 0; // Counter for cycling modifier classes

  if (!toaster) {
    console.warn('Toaster container not found');
    return {
      cleanup: () => {},
      addToast: () => null,
    };
  }

  /**
   * Creates a toast element with animation
   */
  function createToastElement({ label, modifierClass = '' }: ToastOptions): HTMLDivElement {
    const toast = document.createElement('div');
    toast.className = modifierClass ? `toast ${modifierClass}` : 'toast';
    toast.setAttribute('data-mounted', 'false');

    toast.innerHTML = `
      <svg class="toast__icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
  function triggerMountAnimation(toast: HTMLDivElement): void {
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
  function updateToastPositions(): void {
    const toasts = Array.from(toaster!.querySelectorAll('.toast'));
    const totalToasts = toasts.length;

    toasts.forEach((toast, i) => {
      const index = totalToasts - i - 1;
      (toast as HTMLElement).style.setProperty('--index', String(index));
    });
  }

  /**
   * Removes a toast with animation
   */
  function removeToast(toast: HTMLElement): void {
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
  function addToast(customOptions: ToastConfig = {}): HTMLDivElement {
    const toastOptions = { ...options, ...customOptions };

    // Remove oldest toast if we've reached the limit
    // Only count toasts that aren't already being removed
    const existingToasts = Array.from(toaster!.querySelectorAll('.toast')).filter(
      toast => !toast.classList.contains('toast--removing')
    );
    if (existingToasts.length >= toastOptions.maxToasts) {
      const oldestToast = existingToasts[0] as HTMLElement;
      removeToast(oldestToast);
    }

    // Determine modifier class based on counter
    const modifierClasses = ['', 'toast--dark', 'toast--alert'];
    const modifierClass = modifierClasses[toastCounter % 3];
    toastCounter++;

    const toast = createToastElement({ ...toastOptions, modifierClass });

    toast.style.setProperty('--index', '0');
    toaster!.appendChild(toast);

    triggerMountAnimation(toast);
    updateToastPositions();

    // Auto-dismiss if configured
    if (toastOptions.autoDismiss) {
      setTimeout(() => removeToast(toast), toastOptions.dismissDelay);
    }

    return toast;
  }

  // Attach click handler if button exists
  const clickHandler = () => addToast();
  if (addToastBtn) {
    addToastBtn.addEventListener('click', clickHandler);
  }

  // Cleanup function for proper memory management
  const cleanup = () => {
    if (addToastBtn) {
      addToastBtn.removeEventListener('click', clickHandler);
    }
    // Clean up any remaining toasts
    const remainingToasts = toaster!.querySelectorAll('.toast');
    remainingToasts.forEach(toast => toast.remove());
  };

  return { cleanup, addToast };
}

/**
 * Toast notifications provide feedback messages to users about actions or system states.
 * They stack vertically and can be configured to auto-dismiss or require manual dismissal.
 */
const meta: Meta<ToastConfig> = {
  title: 'Alpitronic/Toast',
  tags: ['autodocs'],
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    // Store cleanup function reference
    let cleanupFn: (() => void) | null = null;

    // Initialize the toaster functionality after rendering
    setTimeout(() => {
      const { cleanup } = initToaster(args);
      cleanupFn = cleanup;

      // Store cleanup function for Storybook hot reload
      if (wrapper.firstChild) {
        (wrapper.firstChild as any).__cleanup = cleanup;
      }
    }, 0);

    // Enhanced cleanup on unmount
    const element = wrapper.firstChild as HTMLElement;
    if (element) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === element && cleanupFn) {
              cleanupFn();
              observer.disconnect();
            }
          });
        });
      });

      if (element.parentNode) {
        observer.observe(element.parentNode, { childList: true });
      }
    }

    return element;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The message text displayed in the toast notification',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Message placeholder' },
      },
    },
    autoDismiss: {
      control: 'boolean',
      description: 'Whether the toast should automatically dismiss after a delay',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dismissDelay: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: 'Time in milliseconds before auto-dismissing (only applies if autoDismiss is true)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5000' },
      },
      if: { arg: 'autoDismiss', truthy: true },
    },
    maxToasts: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum number of toasts that can be displayed at once',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A toast notification system with stacking animations. Toasts can be triggered manually and support different visual variants (default, dark, alert) that cycle automatically.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ToastConfig>;

/**
 * Default toast configuration with manual dismiss
 */
export const Default: Story = {
  args: {
    label: 'Message placeholder',
    autoDismiss: false,
    dismissDelay: 5000,
    maxToasts: 3,
  },
};

/**
 * Toast with auto-dismiss enabled
 */
export const AutoDismiss: Story = {
  args: {
    label: 'This toast will auto-dismiss',
    autoDismiss: true,
    dismissDelay: 3000,
    maxToasts: 3,
  },
};

/**
 * Limited stack with only 2 toasts visible at once
 */
export const LimitedStack: Story = {
  args: {
    label: 'Maximum 2 toasts allowed',
    autoDismiss: false,
    dismissDelay: 5000,
    maxToasts: 2,
  },
};

/**
 * Quick dismissal with short delay
 */
export const QuickDismiss: Story = {
  args: {
    label: 'Quick notification',
    autoDismiss: true,
    dismissDelay: 2000,
    maxToasts: 3,
  },
};