import { defineConfig, build as viteBuild, type Plugin, type ResolvedConfig } from 'vite'
import { resolve, join, dirname, extname } from 'node:path'
import { createRequire } from 'node:module'
import { readdirSync, statSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import ts from 'typescript'
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

const nodeRequire = createRequire(import.meta.url)
const aliasMap: Record<string, string> = {
  '@@': resolve(__dirname, '.'),
  '@': resolve(__dirname, 'src'),
}

const resolveAliasImport = (specifier: string) => {
  for (const [alias, target] of Object.entries(aliasMap)) {
    if (specifier === alias) {
      return target
    }
    if (specifier.startsWith(`${alias}/`)) {
      return join(target, specifier.slice(alias.length + 1))
    }
  }

  return specifier
}

const moduleCache = new Map<string, unknown>()

const resolveModulePath = (basePath: string): string => {
  if (existsSync(basePath) && statSync(basePath).isFile()) {
    return basePath
  }

  const extensions = ['.ts', '.tsx', '.js', '.json']

  for (const ext of extensions) {
    const candidate = `${basePath}${ext}`
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate
    }
  }

  for (const ext of extensions) {
    const indexCandidate = join(basePath, `index${ext}`)
    if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
      return indexCandidate
    }
  }

  throw new Error(`Unable to resolve module path: ${basePath}`)
}

const createLocalRequire = (parentPath: string) => (specifier: string) => loadSpecifier(specifier, parentPath)

const loadFileModule = (filePath: string) => {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath)
  }

  const ext = extname(filePath)
  let exports: unknown

  if (ext === '.ts' || ext === '.tsx') {
    const source = readFileSync(filePath, 'utf-8')
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
      fileName: filePath,
    })

    const module = { exports: {} as Record<string, unknown> }
    const runner = new Function('require', 'module', 'exports', outputText)
    runner(createLocalRequire(filePath), module, module.exports)

    exports = module.exports.default ?? module.exports
  } else {
    exports = nodeRequire(filePath)
  }

  moduleCache.set(filePath, exports)
  return exports
}

const loadSpecifier = (specifier: string, parentPath?: string) => {
  const resolvedSpecifier = resolveAliasImport(specifier)
  const isRelative = resolvedSpecifier.startsWith('.') || resolvedSpecifier.startsWith('/')

  if (isRelative) {
    const baseDir = parentPath ? dirname(parentPath) : __dirname
    const absolutePath = resolvedSpecifier.startsWith('/') ? resolvedSpecifier : resolve(baseDir, resolvedSpecifier)
    const modulePath = resolveModulePath(absolutePath)
    return loadFileModule(modulePath)
  }

  return nodeRequire(resolvedSpecifier)
}

const compileManifest = (manifestPath: string) => {
  const resolvedPath = resolveModulePath(manifestPath)
  return loadFileModule(resolvedPath)
}

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
                formats: ['es'],
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

        const filesToCopy = [`${component}.html`, `${component}.setup.js`, `${component}.state.js`, 'preview.png']

        const manifestTsPath = join(srcComponentDir, `${component}.manifest.ts`)
        const manifestJsonPath = join(distComponentDir, `${component}.manifest.json`)

        if (existsSync(manifestTsPath)) {
          const manifestObject = compileManifest(manifestTsPath)
          writeFileSync(manifestJsonPath, JSON.stringify(manifestObject, null, 2))
        }

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
