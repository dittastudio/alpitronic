import { defineConfig, type Plugin } from 'vite'
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
  return {
    name: 'component-builder',
    apply: 'build',
    enforce: 'post',
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

        const htmlPath = join(srcComponentDir, `${component}.html`)
        const tsPath = join(srcComponentDir, `${component}.ts`)
        const cssPath = join(srcComponentDir, `${component}.css`)
        const distHtmlPath = join(distComponentDir, `${component}.html`)
        const distJsPath = join(distComponentDir, `${component}.js`)
        const distCssPath = join(distComponentDir, `${component}.css`)

        const currentResult = {
          Component: component,
          HTML: message(htmlPath, distHtmlPath),
          JS: message(tsPath, distJsPath),
          CSS: message(cssPath, distCssPath),
          COPIED: [] as string[] | string,
        }

        const filesToCopy = [
          `${component}.manifest.json`,
          `${component}.setup.js`,
          `${component}.state.js`,
          'preview.png',
        ]

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

function getComponentEntries() {
  const entries: Record<string, string> = {}
  const srcDir = resolve(__dirname, 'src/components')

  const scanDirectory = (dir: string, basePath: string = '') => {
    const items = readdirSync(dir)

    items.forEach(item => {
      const fullPath = resolve(dir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        const entry = resolve(fullPath, `index.ts`)

        try {
          statSync(entry)
          const entryName = basePath ? `${basePath}/${item}` : item
          entries[entryName] = entry
        } catch {
          scanDirectory(fullPath, basePath ? `${basePath}/${item}` : item)
        }
      }
    })
  }

  scanDirectory(srcDir)

  return entries
}

export default defineConfig({
  plugins: [tailwindcss(), componentBuilderPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      treeshake: false,
      input: getComponentEntries(),
      output: {
        entryFileNames: chunkInfo => `${chunkInfo.name}/[name].js`,
        chunkFileNames: _chunkInfo => 'assets/[name].js',
        assetFileNames: assetInfo => {
          const name = assetInfo.names[0] || ''
          const fileParts = name.split('.')
          const fileName = fileParts.at(0)
          const fileExt = fileParts.at(-1)

          if (fileName && fileExt && ['css', 'html'].includes(fileExt)) {
            return `${fileName}/[name][extname]`
          }

          return 'assets/[name][extname]'
        },
      },
    },
  },
})
