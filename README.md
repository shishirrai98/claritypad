Comprehensive documentation for installation, usage.


# Claritypad WYSIWYG Editor

A lightweight, extensible WYSIWYG editor built with TypeScript, offering a plugin system for rich text editing. Designed for developers, it supports vanilla JavaScript, React, and Next.js with a focus on security, performance, and developer experience.

## Features
- **Plugin System**: Register plugins using class references for easy extension (e.g., `ImagePlugin`, `TablePlugin`).
- **Input Sanitization**: Securely handles user input with `sanitize-html` to prevent XSS attacks.
- **Customizable Toolbar**: Responsive toolbar with configurable menus (File, Edit, Insert) and show/hide functionality.
- **Visual Table Insertion**: Microsoft Word-like grid selector for dynamic row/column selection.
- **Context Menus**: Right-click options for images and tables (e.g., alignment, borders).
- **Cross-Platform**: Compatible with vanilla JS, React, and Next.js.
- **TypeScript Support**: Strong typing for better autocompletion and IDE support.
- **Accessibility**: ARIA attributes and keyboard support for accessibility.

## Installation

```bash
npm install claritypad
```

## Usage

### Vanilla JS
```html
<div id="editor"></div>

<script type="module">
  import { WysiwygEditor } from 'claritypad';
  import { ImagePlugin, TablePlugin } from 'claritypad/plugins';

  const config = {
    toolbar: true,
    menus: ['File', 'Edit', 'Insert', 'Table'],
    plugins: [
      { plugin: ImagePlugin, options: { uploadUrl: '/api/upload', maxWidth: 600 } },
      { plugin: TablePlugin, options: { defaultRows: 3, defaultCols: 3, maxGridSize: 8 } },
    ],
  };

  const editor = new WysiwygEditor('editor', config);
</script>
```

### React
```tsx
import { ReactWysiwyg } from 'claritypad/react';
import { ImagePlugin, TablePlugin } from 'claritypad/plugins';

function App() {
  const config = {
    toolbar: true,
    menus: ['File', 'Edit', 'Insert', 'Table'],
    plugins: [
      { plugin: ImagePlugin, options: { uploadUrl: '/api/upload', maxWidth: 600 } },
      { plugin: TablePlugin, options: { defaultRows: 3, defaultCols: 3 } },
    ],
  };

  return <ReactWysiwyg config={config} />;
}
```

### Next.js
```tsx
import dynamic from 'next/dynamic';
import { ImagePlugin, TablePlugin } from 'claritypad/plugins';

const ReactWysiwyg = dynamic(() => import('claritypad/react'), { ssr: false });

export default function Page() {
  const config = {
    toolbar: true,
    menus: ['File', 'Edit', 'Insert'],
    plugins: [
      { plugin: ImagePlugin, options: { uploadUrl: '/api/upload' } },
      { plugin: TablePlugin },
    ],
  };

  return <ReactWysiwyg config={config} />;
}
```

## Configuration

### EditorConfig
```typescript
interface EditorConfig {
  toolbar?: boolean; // Show/hide toolbar
  menus?: string[]; // Menu names (e.g., ['File', 'Edit', 'Insert'])
  onChange?: (content: string) => void; // Content change callback
  plugins?: Array<{
    plugin: new (options: any) => Plugin;
    options?: Record<string, any>;
  }>;
}
```

### ImagePlugin Options
- `uploadUrl?: string`: Server endpoint for image uploads.
- `onUpload?: (file: File) => Promise<string>`: Custom upload handler.
- `maxWidth?: number`: Maximum image width (default: 800).
- `defaultAlign?: 'left' | 'center' | 'right'`: Default alignment (default: 'center').
- `allowCaptions?: boolean`: Enable/disable captions (default: true).

### TablePlugin Options
- `defaultRows?: number`: Default number of rows (default: 2).
- `defaultCols?: number`: Default number of columns (default: 2).
- `defaultBorder?: string`: Default border style (default: '1px solid #000').
- `defaultBackground?: string`: Default background color (default: '#fff').
- `maxGridSize?: number`: Maximum grid size for visual selector (default: 10).

## API
- `getContent(): string`: Get sanitized editor content.
- `setContent(html: string): void`: Set editor content (sanitized).
- `destroy(): void`: Clean up editor and plugins.

## Development
```bash
npm install
npm run build
npm run test
npm run lint
npm run format
```

### Scripts
- `build`: Bundle with Rollup.
- `lint`: Run ESLint.
- `format`: Format with Prettier.
- `test`: Run Jest tests.

## Testing
The project includes Jest for unit testing. Example:
```bash
npm run test
```

Extend with Playwright for E2E tests if needed.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Issues
Report bugs or suggest features via the [GitHub Issues](https://github.com/shishirrai98/claritypad/issues) page.