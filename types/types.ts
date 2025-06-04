import sanitizeHtml from 'sanitize-html';

export interface Plugin {
  init(editor: Editor): void;
  destroy?(): void;
}

export interface EditorConfig {
  toolbar?: boolean;
  menus?: string[];
  onChange?: (content: string) => void;
  plugins?: Array<{
    plugin: new (options: any) => Plugin;
    options?: Record<string, any>;
  }>;
}

export interface Editor {
  insertElement(element: HTMLElement): void;
  getContent(): string;
  setContent(html: string): void;
  getToolbar(): HTMLElement | null;
}

export const sanitize = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'table',
      'tr',
      'td',
      'figure',
      'figcaption',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'style'],
      table: ['style', 'border', 'cellpadding', 'cellspacing'],
      td: ['style', 'colspan', 'rowspan'],
      figure: ['style'],
      figcaption: ['style'],
    },
  });
};
