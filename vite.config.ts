import { defineConfig, build as viteBuild, type Plugin, type ResolvedConfig } from 'vite'
import { resolve, join } from 'node:path'
import { readdirSync, statSync, existsSync, copyFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'

type Result = {
  Component: string
  HTML: string
  JS: string
  CSS: string
  COPIED: string[] | string
}

const bytesToKB = (bytes: number) => (bytes / 1024).toFixed(2) + ' KB'

const message = (src: string, dist: string) =>
  existsSync(src)
    ? `${existsSync(dist) ? `✅ ${bytesToKB(statSync(dist).size)}` : '⚠️  Not built to dist'}`
    : `❌ Not in src`

function componentBuilderPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig

  return {
    name: 'component-builder',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const srcDir = resolve(__dirname, 'src/components')
      const distDir = resolve(__dirname, 'dist')

      const components = readdirSync(srcDir).filter(item => {
        const itemPath = join(srcDir, item)
        return statSync(itemPath).isDirectory()
      })

      console.log(`\n🧠 Processing files...\n`)

      const results: Result[] = []

      for (const component of components) {
        const srcComponentDir = join(srcDir, component)
        const distComponentDir = join(distDir, component)

        const entry = resolve(srcComponentDir, 'index.ts')

        if (existsSync(entry)) {
          console.log(`🦊 Bundling ${component}...`)

          await viteBuild({
            configFile: false,
            plugins: [tailwindcss()],
            resolve: resolvedConfig.resolve,
            build: {
              emptyOutDir: true,
              outDir: distComponentDir,
              minify: false,
              lib: {
                entry,
                name: component,
                formats: ['iife'], // ✅ No imports/exports
                fileName: () => `${component}.js`,
                cssFileName: `${component}`,
              },
              rollupOptions: {
                external: [],
                output: {
                  extend: true,
                  manualChunks: undefined,
                },
              },
            },
          })
        }

        const htmlPath = join(srcComponentDir, `${component}.html`)
        const tsPath = join(srcComponentDir, `${component}.ts`)
        const cssPath = join(srcComponentDir, `${component}.css`)
        const distHtmlPath = join(distComponentDir, `${component}.html`)
        const distJsPath = join(distComponentDir, `${component}.js`)
        const distCssPath = join(distComponentDir, `${component}.css`)

        const filesToCopy = [
          `${component}.html`,
          `${component}.manifest.json`,
          `${component}.setup.js`,
          `${component}.state.js`,
          'preview.png',
        ]

        let currentResult = {
          Component: component,
          HTML: message(htmlPath, distHtmlPath),
          JS: message(tsPath, distJsPath),
          CSS: message(cssPath, distCssPath),
          COPIED: [] as string[] | string,
        }

        filesToCopy.forEach(file => {
          const srcFile = join(srcComponentDir, file)
          const distFile = join(distComponentDir, file)

          if (existsSync(srcFile)) {
            copyFileSync(srcFile, distFile)

            if (Array.isArray(currentResult.COPIED)) {
              currentResult.COPIED.push(file)
            }
          }
        })

        currentResult = {
          ...currentResult,
          HTML: message(htmlPath, distHtmlPath),
        }

        if (!currentResult.COPIED.length) {
          currentResult.COPIED = 'No files to copy'
        }

        results.push(currentResult)
      }

      console.table(results)
      console.log('\n✅ Component build complete!\n')
    },
  }
}

const IS_NETLIFY = process.env.NETLIFY === 'true'

export default defineConfig({
  plugins: [tailwindcss(), ...(IS_NETLIFY ? [] : [componentBuilderPlugin()])],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: false,
    modulePreload: { polyfill: false },
    lib: {
      entry: resolve(__dirname, 'src/noop.ts'),
      name: 'noop',
      formats: ['es'],
      fileName: () => 'noop.js',
    },
    rollupOptions: {
      treeshake: true,
      output: {
        extend: true,
        manualChunks: undefined,
      },
    },
  },
})
