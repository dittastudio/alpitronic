import { resolve } from 'node:path';
import { join } from 'node:path';
import { readdirSync, statSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

function componentCopyPlugin() {
  return {
    name: 'component-copy',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/components');
      const distDir = resolve(__dirname, 'dist');

      const components = readdirSync(srcDir).filter(item => {
        const itemPath = join(srcDir, item);
        return statSync(itemPath).isDirectory();
      });

      console.log(`\n🔨 Copying component files...\n`);

      const results: Record<string, string>[] = [];

      components.forEach(component => {
        const srcComponentDir = join(srcDir, component);
        const distComponentDir = join(distDir, component);

        mkdirSync(distComponentDir, { recursive: true });

        const filesToCopy = [
          { name: `${component}.html` },
          { name: `${component}.js` },
          { name: `${component}.manifest.json` },
          { name: `${component}.setup.js` },
          { name: `${component}.state.js` },
          { name: 'preview.png' },
        ];

        filesToCopy.forEach(({ name }) => {
          const srcFile = join(srcComponentDir, name);
          const distFile = join(distComponentDir, name);

          if (existsSync(srcFile)) {
            copyFileSync(srcFile, distFile);
            // console.log(`✓ ${component}/${name}`);
            results.push({
              file: `${component}/${name}`,
            });
          }
        });
      });

      console.table(results);

      console.log('\n✅ Component build complete!\n');
    },
  };
}

function getComponentCSSEntries() {
  const srcDir = resolve(__dirname, 'src/components');
  const entries = {};

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
  plugins: [tailwindcss(), componentCopyPlugin()],
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
        assetFileNames: '[name].css',
        entryFileNames: '[name].js',
      },
    },
  },
});
