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
      defaultValue: 'None',
      options: ['None', ...ICON_TYPES],
    },
    ledIndex: {
      type: 'select',
      options: [-1, 0, 1, 2, 3],
      defaultValue: -1,
      description: `Index of the LED to light up when component is mounted (set to -1 to disable).\nThe index corresponds to the LED index on the charging station.`,
    }, // when set to >=0, will light up the led at this index when component is mounted, and turn it off when unmounted
    box: {
      x: { type: 'text', defaultValue: '0px' },
      y: { type: 'text', defaultValue: '0px' },
      width: { type: 'text', defaultValue: '210px' },
      height: { type: 'text', defaultValue: '72px' },
    },
  },
}

export default manifest
