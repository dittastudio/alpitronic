import { resolve, join } from 'node:path';
import { readdirSync, statSync, existsSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vite';
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

      console.log(`\n🧠 Processing components with PurgeCSS...\n`);

      for (const component of components) {
        const srcComponentDir = join(srcDir, component);
        const distComponentDir = join(distDir, component);
        const htmlPath = join(srcComponentDir, `${component}.html`);
        const jsPath = join(srcComponentDir, `${component}.js`);
        const cssPath = join(distComponentDir, `${component}.css`);

        if (existsSync(htmlPath) && existsSync(jsPath) && existsSync(cssPath)) {
          const css = readFileSync(cssPath, 'utf-8');

          const result = await postcss([
            purgeCSSPlugin({
              content: [htmlPath, jsPath],
              defaultExtractor: content => {
                const matches = content.match(/[A-Za-z0-9_-]+(?:\.[0-9]+)?(?:\/[0-9]+)?/g) || [];
                return matches;
              },
              safelist: {
                standard: [/^alert-component/, /^heading-component/, /^component-/],
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

function getComponentCSSEntries() {
  const srcDir = resolve(__dirname, 'src/components');
  const entries: Record<string, string> = {};

  if (!existsSync(srcDir)) {
    return entries;
  }

  readdirSync(srcDir)
    .filter(item => {
      const itemPath = join(srcDir, item);
      return statSync(itemPath).isDirectory();
    })
    .forEach(component => {
      const cssPath = join(srcDir, component, `${component}.css`);
      if (existsSync(cssPath)) {
        entries[`${component}/${component}`] = cssPath;
      }
    });

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
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getComponentCSSEntries(),
      output: {
        assetFileNames: chunkInfo => {
          // console.log('asset chunkInfo:', chunkInfo.names);
          return `[name][extname]`;
        },
        entryFileNames: chunkInfo => {
          // console.log('entry chunkInfo:', chunkInfo.name);
          return `[name].js`;
        },
      },
    },
  },
});
