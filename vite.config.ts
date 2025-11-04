import { defineConfig } from 'vite';
import { resolve, join } from 'node:path';
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import postcss from 'postcss';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

function componentBuilderPlugin() {
  return {
    name: 'component-builder',

    async closeBundle() {
      const srcDir = resolve(__dirname, 'src/components');
      const distDir = resolve(__dirname, 'dist');

      const components = readdirSync(srcDir).filter(item => {
        const itemPath = join(srcDir, item);
        return statSync(itemPath).isDirectory();
      });

      console.log(`\n🧠 Processing files with PurgeCSS...\n`);

      for (const component of components) {
        const srcComponentDir = join(srcDir, component);
        const distComponentDir = join(distDir, component);
        const htmlPath = join(srcComponentDir, `${component}.html`);
        const tsPath = join(srcComponentDir, `${component}.ts`);
        const cssPath = join(distComponentDir, `${component}.css`);

        if (existsSync(htmlPath) && existsSync(tsPath) && existsSync(cssPath)) {
          const css = readFileSync(cssPath, 'utf-8');

          const result = await postcss([
            purgeCSSPlugin({
              content: [htmlPath, tsPath],
              defaultExtractor: content => {
                const matches = content.match(/[A-Za-z0-9_-]+(?:\.[0-9]+)?(?:\/[0-9]+)?/g) || [];
                return matches;
              },
              safelist: {
                standard: [],
                deep: [],
                greedy: [],
              },
            }),
          ]).process(css, { from: cssPath });

          writeFileSync(cssPath, result.css);
          console.log(`🔥 ${component}: PurgeCSS applied`);
        }

        const filesToCopy = [
          `${component}.html`,
          `${component}.js`,
          `${component}.manifest.json`,
          `${component}.setup.js`,
          `${component}.state.js`,
          'preview.png',
        ];

        filesToCopy.forEach(file => {
          const srcFile = join(srcComponentDir, file);
          const distFile = join(distComponentDir, file);

          if (existsSync(srcFile) && existsSync(distFile)) {
            copyFileSync(srcFile, distFile);
          }
        });
      }

      console.log('\n✅ Component build complete!\n');
    },
  };
}

function getComponentEntries() {
  const entries: Record<string, string> = {};
  const srcDir = resolve(__dirname, 'src/components');

  const scanDirectory = (dir: string, basePath: string = '') => {
    const items = readdirSync(dir);

    items.forEach(item => {
      const fullPath = resolve(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        const entry = resolve(fullPath, `index.ts`);

        try {
          statSync(entry);
          const entryName = basePath ? `${basePath}/${item}` : item;
          entries[entryName] = entry;
        } catch {
          scanDirectory(fullPath, basePath ? `${basePath}/${item}` : item);
        }
      }
    });
  };

  try {
    scanDirectory(srcDir);
  } catch {}

  return entries;
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
          const name = assetInfo.names[0] || '';
          const fileParts = name.split('.');
          const fileName = fileParts.at(0);
          const fileExt = fileParts.at(-1);

          if (fileName && fileExt && ['css', 'html'].includes(fileExt)) {
            return `${fileName}/[name][extname]`;
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
});
