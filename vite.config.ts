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
  plugins: [tailwindcss()],
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
        entryFileNames: chunkInfo => `${chunkInfo.name}/[name]-[hash].js`,
        chunkFileNames: _chunkInfo => 'assets/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const name = assetInfo.names[0] || '';

          // console.log('assetInfo:', assetInfo.names);

          const fileParts = name.split('.');
          const fileName = fileParts.at(0);
          const fileExt = fileParts.at(-1);

          if (fileName && fileExt && ['css', 'html'].includes(fileExt)) {
            return `${fileName}/[name]-[hash][extname]`;
          }

          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
