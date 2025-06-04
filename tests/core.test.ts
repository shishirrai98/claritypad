import { ClarityPadEditor } from '../src/core';
import { ImagePlugin } from '../src/plugins/image';
import { TablePlugin } from '../src/plugins/table';

describe('ClarityPadEditor', () => {
  let editor: ClarityPadEditor;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'editor';
    document.body.appendChild(container);
    editor = new ClarityPadEditor('editor', {
      plugins: [
        { plugin: ImagePlugin, options: { maxWidth: 600 } },
        { plugin: TablePlugin, options: { defaultRows: 3 } },
      ],
    });
  });

  afterEach(() => {
    editor.destroy();
    container.remove();
  });

  test('initializes with plugins', () => {
    expect((editor as any).plugins.has('image')).toBe(true);
    expect((editor as any).plugins.has('table')).toBe(true);
  });

  test('sanitizes content', () => {
    editor.setContent('<script>alert("xss")</script><p>Test</p>');
    expect(editor.getContent()).not.toContain('<script>');
    expect(editor.getContent()).toContain('<p>Test</p>');
  });
});