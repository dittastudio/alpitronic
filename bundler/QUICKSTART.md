# Quick Start Guide

Get up and running with the Hyperdesign Widget Bundler in 3 minutes! ⚡

## 1️⃣ Install Dependencies

```bash
cd bundler
npm install
```

## 2️⃣ Build the Widgets

```bash
npm run build
```

This will create a `dist/` folder with your compiled widgets:

```
dist/
├── alert-widget/
│   ├── alert-widget.html
│   ├── alert-widget.js
│   ├── alert-widget.css       ← Includes theme + only used Tailwind classes
│   ├── alert-widget.manifest.json
│   ├── alert-widget.setup.js
│   ├── alert-widget.state.js
│   └── preview.png
└── heading-widget/
    └── [same structure]
```

## 3️⃣ View the Demo

Open `demo.html` in your browser (requires a local server):

```bash
# Using Python
python3 -m http.server 8000

# Using Node
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: http://localhost:8000/demo.html

## 🎨 Customize the Theme

Edit `src/global.css` to change design tokens:

```css
@theme {
  --color-green: #00d300;      /* Change this! */
  --color-blue: #0066ff;       /* And this! */
  --font-montreal: "Your Font", sans-serif;
}
```

Rebuild with `npm run build` and your changes will apply to all widgets.

## 🚀 Create Your Own Widget

1. Create a new folder: `src/my-widget/`
2. Add the required files:
   - `my-widget.html`
   - `my-widget.js`
   - `my-widget.css`
   - `my-widget.manifest.json`
   - `my-widget.setup.js`
   - `my-widget.state.js`

3. In `my-widget.css`:
```css
@import "../global.css";
@source "./my-widget.html";
@source "./my-widget.js";

.my-widget {
  /* Your styles */
}
```

4. Build: `npm run build`

## 📝 Development Tips

- **Watch mode**: `npm run dev` - Rebuilds on file changes
- **Tailwind classes**: Use any Tailwind utility in your HTML
- **Custom styles**: Add component-specific CSS in the widget's CSS file
- **Global styles**: Add shared styles to `src/global.css`

## 📦 Using Built Widgets

Each widget is self-contained. To use in another project:

```html
<link rel="stylesheet" href="alert-widget/alert-widget.css">

<div id="widget"></div>

<script type="module">
  import AlertWidget from './alert-widget/alert-widget.js';

  const widget = new AlertWidget(document.getElementById('widget'));
  widget.render();
</script>
```

## ✨ What Makes This Special

- ✅ Each widget CSS only contains Tailwind classes it actually uses
- ✅ Global theme is included in every widget (self-contained)
- ✅ No build tools needed to use the widgets
- ✅ Works in any HTML page or framework
- ✅ Powered by Tailwind v4's Oxide engine (super fast!)

## 🆘 Troubleshooting

**Build fails?**
- Make sure you're in the `bundler` directory
- Check that Node.js v18+ is installed
- Try deleting `node_modules` and running `npm install` again

**Styles not working?**
- Verify the `@source` paths in your widget CSS are correct
- Check that your HTML uses valid Tailwind classes
- Make sure you imported `global.css` in your widget CSS

**Widget not rendering?**
- Check browser console for errors
- Verify the HTML template is loaded correctly
- Ensure the widget container element exists

Need more help? Check out `README.md` for detailed documentation!

