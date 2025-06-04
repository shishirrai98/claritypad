export interface Plugin {
  init(editor: IClarityPadEditor): void;
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

export interface IClarityPadEditor {
  insertElement(element: HTMLElement): void;
  getContent(): string;
  setContent(html: string): void;
  getToolbar(): HTMLElement | null;
}
