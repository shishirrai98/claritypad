import { Editor, EditorConfig, Plugin, sanitize } from './types';

export class WysiwygEditor implements Editor {
  private editor: HTMLElement;
  private plugins: Map<string, Plugin> = new Map();
  private config: EditorConfig;
  private toolbar: HTMLElement | null = null;

  constructor(elementId: string, config: EditorConfig = {}) {
    const editor = document.getElementById(elementId);
    if (!editor) throw new Error(`Element with ID "${elementId}" not found`);
    this.editor = editor;
    this.editor.contentEditable = 'true';
    this.config = {
      toolbar: true,
      menus: ['File', 'Edit', 'Insert'],
      plugins: [],
      ...config,
    };
    this.init();
  }

  private init(): void {
    if (this.config.toolbar) {
      this.setupToolbar();
    }

    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.editor.addEventListener(
      'contextmenu',
      this.handleContextMenu.bind(this),
    );
    this.initializePlugins();
  }

  private setupToolbar(): void {
    this.toolbar = document.createElement('div');
    this.toolbar.setAttribute('role', 'toolbar');
    this.toolbar.setAttribute('aria-label', 'Editor toolbar');
    this.toolbar.style.display = this.config.toolbar ? 'flex' : 'none';
    this.toolbar.style.flexWrap = 'wrap';
    this.toolbar.style.gap = '10px';
    this.toolbar.style.padding = '10px';
    this.toolbar.style.background = '#f0f0f0';
    this.toolbar.style.borderBottom = '1px solid #ccc';
    this.toolbar.style.boxSizing = 'border-box';
    this.toolbar.style.width = '100%';
    this.toolbar.style.maxWidth = '100%';

    const menuBar = document.createElement('div');
    menuBar.style.display = 'flex';
    menuBar.style.gap = '10px';
    this.config.menus?.forEach((menu) => {
      const menuBtn = document.createElement('button');
      menuBtn.textContent = menu;
      menuBtn.setAttribute('aria-label', `${menu} menu`);
      menuBtn.style.padding = '5px 10px';
      menuBtn.addEventListener('click', () => this.showMenu(menu));
      menuBar.appendChild(menuBtn);
    });
    this.toolbar.appendChild(menuBar);

    this.editor.parentNode?.insertBefore(this.toolbar, this.editor);
  }

  private showMenu(menu: string): void {
    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.background = '#fff';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.padding = '10px';
    dropdown.style.zIndex = '1000';
    dropdown.textContent = `${menu} options`;
    this.toolbar?.appendChild(dropdown);
    setTimeout(() => dropdown.remove(), 2000);
  }

  private initializePlugins(): void {
    this.config.plugins?.forEach(({ plugin, options = {} }) => {
      try {
        const name = plugin.name.replace(/Plugin$/, '').toLowerCase();
        const pluginInstance = new plugin(options);
        this.plugins.set(name, pluginInstance);
        pluginInstance.init(this);
      } catch (error) {
        console.error(`Failed to initialize plugin "${plugin.name}":`, error);
      }
    });
  }

  private handleInput(): void {
    if (this.config.onChange) {
      this.config.onChange(sanitize(this.getContent()));
    }
  }

  private handleContextMenu(e: MouseEvent): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const plugin = this.plugins.get(
      target.closest('img') ? 'image' : target.closest('table') ? 'table' : '',
    );
    if (plugin && 'showContextMenu' in plugin) {
      (plugin as any).showContextMenu(target);
    }
  }

  public insertElement(element: HTMLElement): void {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.insertNode(element);
  }

  public getContent(): string {
    return sanitize(this.editor.innerHTML);
  }

  public setContent(html: string): void {
    this.editor.innerHTML = sanitize(html);
  }

  public getToolbar(): HTMLElement | null {
    return this.toolbar;
  }

  public destroy(): void {
    this.plugins.forEach((plugin) => plugin.destroy?.());
    this.editor.contentEditable = 'false';
    this.editor.removeEventListener('input', this.handleInput.bind(this));
    this.editor.removeEventListener(
      'contextmenu',
      this.handleContextMenu.bind(this),
    );
    this.toolbar?.remove();
  }
}
