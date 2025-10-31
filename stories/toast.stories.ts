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
  containerElement: HTMLElement,
  config: ToastConfig = {}
): { cleanup: () => void; addToast: (options?: ToastConfig) => HTMLDivElement | null } {
  const options = { ...DEFAULT_CONFIG, ...config };

  // Query elements within the container, not the whole document
  const toaster = containerElement.querySelector('#toaster') as HTMLElement;
  const addToastBtn = containerElement.querySelector('#addToastBtn') as HTMLButtonElement;
  const toastTemplate = containerElement.querySelector('#toastTemplate') as HTMLTemplateElement;
  let toastCounter = 0; // Counter for cycling modifier classes

  if (!toaster) {
    console.warn('Toaster container not found');
    return {
      cleanup: () => {},
      addToast: () => null,
    };
  }

  if (!toastTemplate) {
    console.warn('Toast template not found');
    return {
      cleanup: () => {},
      addToast: () => null,
    };
  }

  /**
   * Creates a toast element from template
   */
  function createToastElement({ label, modifierClass = '' }: ToastOptions): HTMLDivElement {
    // Clone the template content
    const toastFragment = toastTemplate.content.cloneNode(true) as DocumentFragment;
    const toast = toastFragment.querySelector('.toast') as HTMLDivElement;

    // Add modifier class if provided
    if (modifierClass) {
      toast.classList.add(modifierClass);
    }

    // Update the label text
    const labelElement = toast.querySelector('.toast__label');
    if (labelElement) {
      labelElement.textContent = label || '';
    }

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
    // Clean up any remaining toasts from this specific instance
    const remainingToasts = toaster.querySelectorAll('.toast');
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
    const element = wrapper.firstChild as HTMLElement;

    // Initialize the toaster functionality after rendering
    setTimeout(() => {
      // Pass the element as the first argument so queries are scoped to this instance
      const { cleanup, addToast } = initToaster(element, args);

      // Store cleanup and addToast functions for Storybook lifecycle management
      (element as any).__cleanup = cleanup;
      (element as any).__addToast = addToast;
    }, 0);

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
 * Default toast configuration with manual dismiss.
 * Click the "Add toast" button to see toasts with different visual variants (default, dark, alert).
 */
export const Default: Story = {
  args: {
    label: 'Message placeholder',
    autoDismiss: false,
    dismissDelay: 5000,
    maxToasts: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'The default toast configuration. Toasts stack vertically and must be manually dismissed. Each toast cycles through three visual variants: default (white), dark, and alert (red).',
      },
    },
  },
};

/**
 * Toast with auto-dismiss enabled.
 * Toasts will automatically disappear after 3 seconds.
 */
export const AutoDismiss: Story = {
  args: {
    label: 'This toast will auto-dismiss',
    autoDismiss: true,
    dismissDelay: 3000,
    maxToasts: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates auto-dismiss behavior. Click "Add toast" and watch it automatically disappear after 3 seconds.',
      },
    },
  },
};

/**
 * Limited stack with only 2 toasts visible at once.
 * When a third toast is added, the oldest one is removed automatically.
 */
export const LimitedStack: Story = {
  args: {
    label: 'Maximum 2 toasts allowed',
    autoDismiss: false,
    dismissDelay: 5000,
    maxToasts: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Limits the stack to only 2 toasts. Try adding more than 2 toasts - the oldest will be automatically removed.',
      },
    },
  },
};

/**
 * Quick dismissal with short delay.
 * Perfect for brief notifications.
 */
export const QuickDismiss: Story = {
  args: {
    label: 'Quick notification',
    autoDismiss: true,
    dismissDelay: 2000,
    maxToasts: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Fast auto-dismiss for brief notifications. Toasts disappear after just 2 seconds.',
      },
    },
  },
};