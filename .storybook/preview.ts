import '../src/css/storybook.css'
import type { Preview, StoryFn, StoryContext } from '@storybook/html-vite'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

const USER = 'mxm'
const PWD = 'FishAndChips@UK!'

const inputUser = window.prompt('Username:')
const inputPwd = window.prompt('Password:')

if (inputUser !== USER || inputPwd !== PWD) {
  document.body.innerHTML = '<h1>Access Denied</h1>'
  throw new Error('Invalid credentials.')
}

export const loaders = [
  async (context: StoryContext) => {
    const stylesheets: string[] = []

    if (Array.isArray(context?.component)) {
      for (const comp of context.component) {
        const cssModule = await import(`../src/components/${comp}/${comp}.css?inline`)
        stylesheets.push(cssModule)
      }
    } else if (typeof context?.component === 'string') {
      const cssModule = await import(`../src/components/${context.component}/${context.component}.css?inline`)
      stylesheets.push(cssModule)
    }

    return { stylesheets }
  },
]

export const decorators = [
  (Story: StoryFn, context: StoryContext) => {
    const stylesheets = context.loaded?.stylesheets
    const story = Story({}, context)

    if (stylesheets?.length) {
      const container = document.createElement('div')

      for (const sheet of stylesheets) {
        const styleTag = document.createElement('style')
        styleTag.innerHTML = sheet.default

        container.appendChild(styleTag)
      }

      if (typeof story === 'string') {
        container.innerHTML += story
      } else if (story instanceof HTMLElement) {
        container.appendChild(story)
      }

      return container
    }

    return story
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
