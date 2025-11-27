import { ICON_TYPES } from '@/utils/fields'
import type { ManifestSchema } from '@@/types/hmi'

const manifest: ManifestSchema = {
  tagName: 'a-mxm-icon-system',
  html: ['mxm-icon-system.html'],
  js: ['mxm-icon-system.js'],
  css: ['mxm-icon-system.css'],
  state: 'mxm-icon-system.state.js',
  setup: 'mxm-icon-system.setup.js',
  preview: 'preview.png',
  props: {
    icon: {
      type: 'select',
      defaultValue: '1',
      options: ICON_TYPES,
    },
    box: {
      x: { type: 'text', defaultValue: '0px' },
      y: { type: 'text', defaultValue: '0px' },
      width: { type: 'text', defaultValue: '60px' },
      height: { type: 'text', defaultValue: '60px' },
    },
  },
}

export default manifest
