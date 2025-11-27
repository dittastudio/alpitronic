import { ICON_TYPES } from '@/utils/fields'
import type { ManifestSchema } from '@@/types/hmi'

const manifest: ManifestSchema = {
  tagName: 'a-mxm-button',
  html: ['mxm-button.html'],
  js: ['mxm-button.js'],
  css: ['mxm-button.css'],
  state: 'mxm-button.state.js',
  setup: 'mxm-button.setup.js',
  preview: 'preview.png',
  props: {
    text: { type: 'text', defaultValue: 'Button' },
    icon: {
      type: 'select',
      defaultValue: '1',
      options: ['None', ...ICON_TYPES],
    },
    box: {
      x: { type: 'text', defaultValue: '0px' },
      y: { type: 'text', defaultValue: '0px' },
      width: { type: 'text', defaultValue: '210px' },
      height: { type: 'text', defaultValue: '72px' },
    },
  },
}

export default manifest
