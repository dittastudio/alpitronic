import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, join } from 'path';
import { readdirSync, statSync, existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import postcss from 'postcss';
import purgecss from '@fullhuman/postcss-purgecss';

const __dirname = new URL('.', import.meta.url).pathname;

function widgetBuilderPlugin() {
  return {
    name: 'widget-builder',

    async closeBundle() {
      const srcDir = resolve(__dirname, 'src');
      const distDir = resolve(__dirname, 'dist');

      const widgets = readdirSync(srcDir).filter(item => {
        const itemPath = join(srcDir, item);
        return statSync(itemPath).isDirectory() && item.endsWith('-widget');
      });

      console.log(`\n🔨 Processing widgets with PurgeCSS...\n`);

      for (const widget of widgets) {
        const srcWidgetDir = join(srcDir, widget);
        const distWidgetDir = join(distDir, widget);
        const htmlPath = join(srcWidgetDir, `${widget}.html`);
        const jsPath = join(srcWidgetDir, `${widget}.js`);
        const cssPath = join(distWidgetDir, `${widget}.css`);

        // Apply PurgeCSS to remove unused utilities
        if (existsSync(cssPath)) {
          const css = readFileSync(cssPath, 'utf-8');

          const result = await postcss([
            purgecss({
              content: [htmlPath, jsPath],
              defaultExtractor: content => {
                // Match Tailwind's class patterns
                const matches = content.match(/[A-Za-z0-9_-]+(?:\.[0-9]+)?(?:\/[0-9]+)?/g) || [];
                return matches;
              },
              safelist: {
                standard: [/^alert-widget/, /^heading-widget/, /^widget-/],
                deep: [],
                greedy: []
              }
            })
          ]).process(css, { from: cssPath });

          writeFileSync(cssPath, result.css);
          console.log(`  ✓ ${widget} - PurgeCSS applied`);
        }

        // Copy non-CSS files
        const filesToCopy = [
          `${widget}.html`,
          `${widget}.js`,
          `${widget}.manifest.json`,
          `${widget}.setup.js`,
          `${widget}.state.js`,
          'preview.png',
        ];

        filesToCopy.forEach((file) => {
          const srcFile = join(srcWidgetDir, file);
          const distFile = join(distWidgetDir, file);

          if (existsSync(srcFile)) {
            copyFileSync(srcFile, distFile);
          }
        });

        // Clean up temporary JS file if it exists
        const tempJs = join(distWidgetDir, `${widget}.js`);
        if (existsSync(tempJs)) {
          try {
            rmSync(tempJs);
          } catch (e) {
            // Ignore
          }
        }
      }

      console.log('\n✅ Widget build complete!\n');
    }
  };
}

function getWidgetCSSEntries() {
  const srcDir = resolve(__dirname, 'src');
  const entries = {};

  if (!existsSync(srcDir)) {
    return entries;
  }

  readdirSync(srcDir)
    .filter(item => {
      const itemPath = join(srcDir, item);
      return statSync(itemPath).isDirectory() && item.endsWith('-widget');
    })
    .forEach(widget => {
      const cssPath = join(srcDir, widget, `${widget}.css`);
      if (existsSync(cssPath)) {
        entries[`${widget}/${widget}`] = cssPath;
      }
    });

  return entries;
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    widgetBuilderPlugin()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getWidgetCSSEntries(),
      output: {
        assetFileNames: '[name].css',
        entryFileNames: '[name].js',
      }
    }
  }
});
