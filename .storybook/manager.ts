import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

const USER = 'mxm'
const PASS = 'FishAndChips@UK!'

const username = window.prompt('Username:')
const password = window.prompt('Password:')

if (username !== USER || password !== PASS) {
  document.documentElement.innerHTML = `
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        color: #fff;
        background-color: #222;
        margin: 0;
        padding: 40px;
      }
    </style>
    <h1>🤖 Access denied</h1>
  `

  throw new Error('Unauthorized')
}

addons.setConfig({
  theme: themes.dark,
})
