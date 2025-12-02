import { ICON_TYPES } from '@/utils/fields'
import type { ManifestSchema } from '@@/types/hmi'

const manifest: ManifestSchema = {
  tagName: 'a-mxm-navigation',
  html: ['mxm-navigation.html'],
  js: ['mxm-navigation.js'],
  css: ['mxm-navigation.css'],
  state: 'mxm-navigation.state.js',
  setup: 'mxm-navigation.setup.js',
  preview: 'preview.png',
  props: {
    button1Enabled: {
      type: 'boolean',
      defaultValue: true,
    },
    button1: {
      text: {
        type: 'translation',
        defaultValue: 'Button1',
      },
      icon: {
        type: 'select',
        options: ['None', ...ICON_TYPES],
        defaultValue: 'None',
      },
    },
    button2Enabled: {
      type: 'boolean',
      defaultValue: true,
    },
    button2: {
      text: {
        type: 'translation',
        defaultValue: 'Button2',
      },
      icon: {
        type: 'select',
        options: ['None', ...ICON_TYPES],
        defaultValue: 'None',
      },
    },
    button3Enabled: {
      type: 'boolean',
      defaultValue: true,
    },
    button3: {
      text: {
        type: 'translation',
        defaultValue: 'Button3',
      },
      icon: {
        type: 'select',
        options: ['None', ...ICON_TYPES],
        defaultValue: 'None',
      },
    },
    button4Enabled: {
      type: 'boolean',
      defaultValue: true,
    },
    button4: {
      text: {
        type: 'translation',
        defaultValue: 'Button4',
      },
      icon: {
        type: 'select',
        options: ['None', ...ICON_TYPES],
        defaultValue: 'None',
      },
    },
    box: {
      x: { type: 'text', defaultValue: '0px' },
      y: { type: 'text', defaultValue: '612px' }, // 712px (project height) - 100px
      width: { type: 'text', defaultValue: '100%' },
      height: { type: 'text', defaultValue: '100px' },
    },
  },
}

export default manifest
