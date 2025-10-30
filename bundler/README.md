# Hyperdesign Widget Bundler

A Vite + Tailwind CSS v4 build system for creating self-contained, production-ready widgets.

## Features

- 🎨 **Tailwind CSS v4** with JIT compilation
- 🎯 **Per-widget optimization** - Each widget only includes the Tailwind classes it uses
- 🔧 **Shared theme** - Global design tokens across all widgets
- 📦 **Self-contained output** - Each widget is independently deployable
- ⚡ **Fast builds** - Powered by Vite and Tailwind's Oxide engine

## Project Structure

```
bundler/
├── src/
│   ├── global.css                    # Shared theme and Tailwind import
│   ├── alert-widget/
│   │   ├── alert-widget.html         # Widget markup
│   │   ├── alert-widget.js           # Widget logic
│   │   ├── alert-widget.css          # Widget styles (imports global.css)
│   │   ├── alert-widget.manifest.json
│   │   ├── alert-widget.setup.js
│   │   ├── alert-widget.state.js
│   │   └── preview.png (optional)
│   └── heading-widget/
│       └── ...
├── dist/                             # Build output
├── vite.config.js
└── package.json
```

## Getting Started

### 1. Install Dependencies

```bash
cd bundler
npm install
```

### 2. Create a Widget

Each widget folder must end with `-widget` and contain:

**Required files:**
- `[name]-widget.html` - Your widget markup (div-based, no html/body tags)
- `[name]-widget.css` - Your widget styles
- `[name]-widget.js` - Your widget JavaScript
- `[name]-widget.manifest.json` - Widget metadata
- `[name]-widget.setup.js` - Configuration logic
- `[name]-widget.state.js` - State management

**Optional:**
- `preview.png` - Preview image

### 3. Widget CSS Structure

Each widget's CSS should follow this structure:

```css
@import "../global.css";
@source "./my-widget.html";
@source "./my-widget.js";

/* Your component styles */
.my-widget {
  /* Custom styles here */
}
```

The `@source` directives tell Tailwind which files to scan, and PurgeCSS removes any unused utilities during the build process, ensuring each widget only includes the CSS it needs.

### 4. Global Theme

Edit `src/global.css` to configure your design system:

```css
@import "tailwindcss";

@theme {
  /* Your design tokens */
  --color-green: #00d300;
  --font-montreal: "PP Neue Montreal", sans-serif;
}

:root {
  /* Additional CSS variables */
  --border-radius-default: 8px;
}
```

### 5. Build

```bash
npm run build
```

This creates optimized widget bundles in `dist/`:

```
dist/
├── alert-widget/
│   ├── alert-widget.html
│   ├── alert-widget.js
│   ├── alert-widget.css          # Includes theme + only used Tailwind classes
│   ├── alert-widget.manifest.json
│   ├── alert-widget.setup.js
│   ├── alert-widget.state.js
│   └── preview.png
└── heading-widget/
    └── ...
```

### 6. Development Mode

Watch for changes and rebuild automatically:

```bash
npm run dev
```

## How It Works

1. **Global Theme** - `global.css` defines shared design tokens using Tailwind v4's `@theme` syntax
2. **Widget CSS** - Each widget imports `global.css` and uses `@source` to specify which files to scan
3. **Build Process**:
   - Vite + Tailwind v4 processes each widget's CSS independently
   - Scans only that widget's HTML/JS for Tailwind classes (via `@source`)
   - PurgeCSS removes any unused utilities from the output
   - Includes the global theme in every output
   - Generates optimized, self-contained CSS files (6-8KB each)
4. **Output** - Each widget folder contains everything needed to deploy independently

## Using Widgets

Each widget is self-contained and can be used like this:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="alert-widget/alert-widget.css">
</head>
<body>
  <div id="alert-container">
    <!-- Widget HTML goes here -->
  </div>

  <script type="module">
    import AlertWidget from './alert-widget/alert-widget.js';

    const widget = new AlertWidget(
      document.getElementById('alert-container'),
      { type: 'success' }
    );
    widget.render();
  </script>
</body>
</html>
```

## Customization

### Adding More Design Tokens

Edit `src/global.css`:

```css
@theme {
  --color-primary: #0066ff;
  --color-secondary: #00d300;
  --spacing-unit: 8px;
  --font-heading: "Your Font", sans-serif;
}
```

### Widget Manifest

The manifest file provides metadata about each widget:

```json
{
  "name": "my-widget",
  "version": "1.0.0",
  "description": "Widget description",
  "tags": ["tag1", "tag2"],
  "category": "feedback"
}
```

## Tips

- ✅ Use Tailwind utilities in your HTML for rapid development
- ✅ Keep component-specific styles in the widget's CSS file
- ✅ Use the manifest for categorization and searchability
- ✅ Preview images help with widget galleries
- ✅ The setup.js file is great for default configurations
- ✅ The state.js file provides reactive state management

## Tailwind v4 Features

This setup uses the latest Tailwind CSS v4 features:
- No `tailwind.config.js` needed
- `@theme` for inline configuration
- `@source` for content scanning
- No PostCSS required
- Built-in autoprefixing
- Lightning-fast Oxide engine

Enjoy building! 🚀

