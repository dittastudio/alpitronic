import '../src/css/storybook.css'
import type { Preview, StoryFn, StoryContext } from '@storybook/html-vite'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
// import { disableInjectedCSS } from '../src/utils/storybook'

export const decorators = [
  (Story: StoryFn, context: StoryContext) => {
    console.log('Storybook asset hack disabled in preview.ts decorator.')
    // if (Array.isArray(context?.component) || typeof context?.component === 'string') {
    //   disableInjectedCSS(context.component)
    // }

    return Story({}, context)
  },
]

const alpitronicViewports = {
  main: {
    name: 'HYC150 to HYC400',
    styles: {
      width: '1366px',
      height: '768px',
    },
    type: 'desktop',
  },
}

const preview: Preview = {
  globalTypes: {
    accent: {
      description: 'Accent Colour',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { title: 'Green', right: '🟢', value: '#54e300' },
          { title: 'Red', right: '🔴', value: '#ff0000' },
          { title: 'Orange', right: '🟠', value: '#ff3700' },
          { title: 'Yellow', right: '🟡', value: '#f9ae00' },
        ],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
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
}

export default preview
