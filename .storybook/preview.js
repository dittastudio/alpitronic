/** @type { import('@storybook/html-vite').Preview } */

import { INITIAL_VIEWPORTS } from 'storybook/viewport';

const alpitronicViewports = {
  main: {
    name: 'HYC150 to HYC400',
    styles: {
      width: '1366px',
      height: '768px',
    },
    type: 'desktop',
  },
};

const preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#333' },
        { name: 'light', value: '#F8F8F8' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        ...alpitronicViewports,
        ...INITIAL_VIEWPORTS,
      },
    },
  },
  initialGlobals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export default preview;
