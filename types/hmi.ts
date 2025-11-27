export type ManifestSchema = {
  tagName: string
  html: string[]
  js: string[]
  css: string[]
  state: string
  setup: string
  preview: string
  props: Record<string, any>
}
