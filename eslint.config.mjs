import html from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import betterTailwind from 'eslint-plugin-better-tailwindcss';

export default [
  {
    ignores: ['**/*.state.js', '**/*.setup.js'],
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@html-eslint': html,
      'better-tailwindcss': betterTailwind,
    },
    languageOptions: {
      parser: htmlParser,
    },
    rules: {
      // enable all recommended rules to report a warning
      ...betterTailwind.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...betterTailwind.configs['recommended-error'].rules,

      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
        printWidth: 1, // wrap when class-string would exceed this many chars
        preferSingleLine: true, // allow multiline when long (true forces single-line where possible)
      }],
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/no-unregistered-classes': 'off', // Allow custom CSS classes
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/css/app.css',
      },
    },
  },
];

