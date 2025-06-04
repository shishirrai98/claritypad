import { IClarityPadEditor, Plugin } from '../../types/type';
import { sanitize } from '../../utils';

interface ImagePluginOptions {
  uploadUrl?: string;
  onUpload?: (file: File) => Promise<string>;
  maxWidth?: number;
  defaultAlign?: 'left' | 'center' | 'right';
  allowCaptions?: boolean;
}

export class ImagePlugin implements Plugin {
  private editor: IClarityPadEditor;
  private options: ImagePluginOptions;
  private pendingImageSrc: string | null = null;

  constructor(options: ImagePluginOptions = {}) {
    this.options = {
      maxWidth: 800,
      defaultAlign: 'center',
      allowCaptions: true,
      ...options,
    };
    this.editor = {} as IClarityPadEditor; // Will be set in init
  }

  public init(editor: IClarityPadEditor): void {
    this.editor = editor;
    this.setupUI();
    this.editor
      .getToolbar()
      ?.addEventListener('drop', this.handleDrop.bind(this));
  }

  private setupUI(): void {
    const toolbar = this.editor.getToolbar();
    if (!toolbar) return;

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = 'Insert Image';
    uploadBtn.setAttribute('aria-label', 'Insert image');
    uploadBtn.style.padding = '5px 10px';
    uploadBtn.addEventListener('click', () => this.showImageDialog());
    toolbar.appendChild(uploadBtn);
  }

  private showImageDialog(): void {
    const dialog = this.createDialog();
    const fileInput = this.createFileInput();
    const urlInput = this.createUrlInput();
    const altInput = this.createTextInput('Alt text');
    const captionInput = this.createTextInput(
      'Caption',
      !this.options.allowCaptions
    );
    const widthInput = this.createNumberInput(
      'Width (px)',
      this.options.maxWidth
    );
    const alignSelect = this.createAlignSelect();
    const submitBtn = this.createSubmitButton(dialog, {
      altInput,
      captionInput,
      widthInput,
      alignSelect,
    });

    dialog.append(
      fileInput,
      urlInput,
      altInput,
      captionInput,
      widthInput,
      alignSelect,
      submitBtn
    );
    document.body.appendChild(dialog);
  }

  private createDialog(): HTMLDivElement {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.background = '#fff';
    dialog.style.padding = '20px';
    dialog.style.border = '1px solid #ccc';
    dialog.style.zIndex = '1000';
    dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    return dialog;
  }

  private createFileInput(): HTMLInputElement {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.marginBottom = '10px';
    fileInput.addEventListener('change', e =>
      this.handleFile((e.target as HTMLInputElement).files?.[0])
    );
    return fileInput;
  }

  private createUrlInput(): HTMLInputElement {
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter image URL';
    urlInput.style.marginBottom = '10px';
    urlInput.style.width = '100%';
    urlInput.addEventListener('change', e =>
      this.handleUrl((e.target as HTMLInputElement).value)
    );
    return urlInput;
  }

  private createTextInput(
    placeholder: string,
    hidden = false
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.marginBottom = '10px';
    input.style.width = '100%';
    if (hidden) input.style.display = 'none';
    return input;
  }

  private createNumberInput(
    placeholder: string,
    defaultValue?: number
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = placeholder;
    input.style.marginBottom = '10px';
    input.style.width = '100%';
    if (defaultValue) input.value = defaultValue.toString();
    return input;
  }

  private createAlignSelect(): HTMLSelectElement {
    const alignSelect = document.createElement('select');
    alignSelect.style.marginBottom = '10px';
    alignSelect.style.width = '100%';
    ['left', 'center', 'right'].forEach(align => {
      const option = document.createElement('option');
      option.value = align;
      option.textContent = align.charAt(0).toUpperCase() + align.slice(1);
      if (align === this.options.defaultAlign) option.selected = true;
      alignSelect.appendChild(option);
    });
    return alignSelect;
  }

  private createSubmitButton(
    dialog: HTMLDivElement,
    inputs: {
      altInput: HTMLInputElement;
      captionInput: HTMLInputElement;
      widthInput: HTMLInputElement;
      alignSelect: HTMLSelectElement;
    }
  ): HTMLButtonElement {
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Insert';
    submitBtn.style.padding = '5px 10px';
    submitBtn.addEventListener('click', () => {
      this.insertImage({
        src: this.pendingImageSrc || '',
        alt: sanitize(inputs.altInput.value),
        caption: sanitize(inputs.captionInput.value),
        width: parseInt(inputs.widthInput.value) || undefined,
        align: inputs.alignSelect.value as 'left' | 'center' | 'right',
      });
      dialog.remove();
    });
    return submitBtn;
  }

  private async handleFile(file?: File): Promise<void> {
    if (!file || !file.type.startsWith('image/')) return;

    if (this.options.onUpload) {
      this.pendingImageSrc = await this.options.onUpload(file);
    } else if (this.options.uploadUrl) {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(this.options.uploadUrl, {
        method: 'POST',
        body: formData,
      });
      const { url } = await response.json();
      this.pendingImageSrc = url;
    } else {
      const reader = new FileReader();
      reader.onload = e => (this.pendingImageSrc = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  private handleUrl(url: string): void {
    this.pendingImageSrc = sanitize(url);
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) {
      this.handleFile(file);
    }
  }

  private insertImage({
    src,
    alt,
    caption,
    width,
    align,
  }: {
    src: string;
    alt: string;
    caption: string;
    width?: number;
    align: 'left' | 'center' | 'right';
  }): void {
    if (!src) return;

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Image';
    if (width)
      img.style.width = `${Math.min(width, this.options.maxWidth || 800)}px`;
    if (align === 'center') {
      figure.style.textAlign = 'center';
    } else {
      img.style.float = align;
    }
    figure.appendChild(img);

    if (caption && this.options.allowCaptions) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
    }

    this.editor.insertElement(figure);
  }

  public showContextMenu(target: HTMLElement): void {
    const img = target.closest('img');
    if (!img) return;

    const dialog = this.createDialog();
    dialog.style.left = `${target.getBoundingClientRect().right}px`;
    dialog.style.top = `${target.getBoundingClientRect().top}px`;

    const altInput = this.createTextInput('Alt text', false);
    altInput.value = img.alt || '';
    const widthInput = this.createNumberInput(
      'Width (px)',
      parseInt(img.style.width) || this.options.maxWidth
    );
    const alignSelect = this.createAlignSelect();
    alignSelect.value =
      img.style.float || this.options.defaultAlign || 'center';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Apply';
    submitBtn.addEventListener('click', () => {
      img.alt = sanitize(altInput.value);
      img.style.width = `${Math.min(
        parseInt(widthInput.value) || this.options.maxWidth!,
        this.options.maxWidth!
      )}px`;
      img.style.float = alignSelect.value === 'center' ? '' : alignSelect.value;
      img.parentElement!.style.textAlign =
        alignSelect.value === 'center' ? 'center' : '';
      dialog.remove();
    });

    dialog.append(altInput, widthInput, alignSelect, submitBtn);
    document.body.appendChild(dialog);
  }
}
