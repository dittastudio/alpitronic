import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';
// import postcss from 'postcss';
// import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

function getComponentEntries() {
  const entries: Record<string, string> = {};
  const srcDir = resolve(__dirname, 'src/components');

  const scanDirectory = (dir: string, basePath: string = '') => {
    const items = readdirSync(dir);

    items.forEach(item => {
      const fullPath = resolve(dir, item);
      const stat = statSync(fullPath);

      // console.log('fullPath: ', fullPath);
      // console.log('stat (isDirectory): ', stat.isDirectory());

      if (stat.isDirectory()) {
        // console.log('item: ', item);
        const htmlFile = resolve(fullPath, `${item}.html`);

        console.log('htmlFile: ', htmlFile);

        try {
          statSync(htmlFile);
          const entryName = basePath ? `${basePath}/${item}` : item;

          console.log('entryName: ', entryName);

          entries[entryName] = htmlFile;
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
  plugins: [
    tailwindcss(),
    // componentBuilderPlugin()
  ],
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
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'index') {
            return 'assets/[name]-[hash].js';
          }
          return `${chunkInfo.name}/[name]-[hash].js`;
        },
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          for (const entry in getComponentEntries()) {
            if (entry !== 'index' && facadeModuleId.includes(`/${entry}/`)) {
              return `${entry}/[name]-[hash].js`;
            }
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: assetInfo => {
          const name = assetInfo.name || '';

          if (name.endsWith('.html')) {
            for (const entry in getComponentEntries()) {
              if (entry !== 'index' && name.includes(`/${entry}/`)) {
                return `${entry}/[name][extname]`;
              }
            }
            return '[name][extname]';
          }

          for (const entry in getComponentEntries()) {
            // console.log('LOOPING: getComponentEntries');
            if (entry !== 'index' && name.includes(`/${entry}/`)) {
              // console.log('ENTRY:', entry, name);
              return `${entry}/[name]-[hash][extname]`;
            }
          }

          // console.log('OTHER:', name);

          const fileParts = name.split('.');
          const fileName = fileParts.at(0);
          const fileExt = fileParts.at(-1);

          if (fileName && fileExt && fileExt === 'css') {
            // console.log('WE HAVE CSS', fileName, fileExt);
            return `${fileName}/[name]-[hash][extname]`;
          }

          return 'assets/[name]-[hash][extname]';
          // return `${entry}/[name]-[hash][extname]`
        },
      },
    },
  },
});
