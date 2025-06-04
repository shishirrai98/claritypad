import { IClarityPadEditor, Plugin } from '../../types/type';
interface TablePluginOptions {
  defaultRows?: number;
  defaultCols?: number;
  defaultBorder: string;
  defaultBackground: string;
  maxGridSize?: number;
}

export class TablePlugin implements Plugin {
  private editor: IClarityPadEditor;
  private options: TablePluginOptions;

  constructor(options: TablePluginOptions = {} as TablePluginOptions) {
    this.options = {
      ...options,
    };
    this.editor = {} as IClarityPadEditor; // Will be set in init
  }

  public init(editor: IClarityPadEditor): void {
    this.editor = editor;
    this.setupUI();
    this.editor
      .getToolbar()
      ?.addEventListener('click', this.handleTableClick.bind(this));
  }

  private setupUI(): void {
    const toolbar = this.editor.getToolbar();
    if (!toolbar) return;

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Insert Table';
    createBtn.setAttribute('aria-label', 'Insert table');
    createBtn.style.padding = '5px 10px';
    createBtn.addEventListener('click', () => this.showTableGrid());
    toolbar.appendChild(createBtn);
  }

  private showTableGrid(): void {
    const dialog = this.createDialog();
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${this.options.maxGridSize}, 20px)`;
    grid.style.gap = '2px';
    grid.style.padding = '10px';
    grid.style.background = '#fff';
    grid.style.border = '1px solid #ccc';

    let selectedRows = this.options.defaultRows!;
    let selectedCols = this.options.defaultCols!;

    for (let i = 0; i < this.options.maxGridSize!; i++) {
      for (let j = 0; j < this.options.maxGridSize!; j++) {
        const cell = document.createElement('div');
        cell.style.width = '20px';
        cell.style.height = '20px';
        cell.style.border = '1px solid #ccc';
        cell.style.background =
          i < selectedRows && j < selectedCols ? '#007bff' : '#fff';
        cell.addEventListener('mouseover', () => {
          selectedRows = i + 1;
          selectedCols = j + 1;
          Array.from(grid.children).forEach((c, idx) => {
            const row = Math.floor(idx / this.options.maxGridSize!);
            const col = idx % this.options.maxGridSize!;
            (c as HTMLElement).style.background =
              row < selectedRows && col < selectedCols ? '#007bff' : '#fff';
          });
        });
        cell.addEventListener('click', () => {
          this.createTable(selectedRows, selectedCols);
          dialog.remove();
        });
        grid.appendChild(cell);
      }
    }

    dialog.appendChild(grid);
    document.body.appendChild(dialog);
  }

  private createDialog(): HTMLDivElement {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.background = '#fff';
    dialog.style.padding = '10px';
    dialog.style.border = '1px solid #ccc';
    dialog.style.zIndex = '1000';
    dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    return dialog;
  }

  private createTable(rows: number, cols: number): void {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.resize = 'both';
    table.style.overflow = 'auto';
    table.style.backgroundColor = this.options.defaultBackground;

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.style.border = this.options.defaultBorder;
        td.style.padding = '8px';
        td.textContent = 'Cell';
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    this.editor.insertElement(table);
    this.addResizeHandles(table);
  }

  private addResizeHandles(table: HTMLTableElement): void {
    table.style.position = 'relative';
    const resizeHandle = document.createElement('div');
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.background = '#000';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    resizeHandle.style.cursor = 'se-resize';

    resizeHandle.addEventListener('mousedown', e => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = table.offsetWidth;
      const startHeight = table.offsetHeight;

      const onMouseMove = (e: MouseEvent) => {
        table.style.width = `${startWidth + (e.clientX - startX)}px`;
        table.style.height = `${startHeight + (e.clientY - startY)}px`;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener(
        'mouseup',
        () => {
          document.removeEventListener('mousemove', onMouseMove);
        },
        { once: true }
      );
    });

    table.appendChild(resizeHandle);
  }

  private handleTableClick(e: MouseEvent): void {
    const cell = (e.target as HTMLElement).closest('td');
    if (cell) {
      // Removed showCellOptions as it’s not defined
    }
  }

  public showContextMenu(target: HTMLElement): void {
    const cell = target.closest('td');
    if (!cell) return;

    const dialog = this.createDialog();
    dialog.style.left = `${target.getBoundingClientRect().right}px`;
    dialog.style.top = `${target.getBoundingClientRect().top}px`;

    const borderStyle = document.createElement('select');
    ['solid', 'dashed', 'dotted'].forEach(style => {
      const option = document.createElement('option');
      option.value = style;
      option.textContent = style;
      borderStyle.appendChild(option);
    });

    const borderWidth = document.createElement('input');
    borderWidth.type = 'number';
    borderWidth.placeholder = 'Border Width (px)';
    borderWidth.value = '1';
    borderWidth.style.marginBottom = '10px';
    borderWidth.style.width = '100%';

    const borderColor = document.createElement('input');
    borderColor.type = 'color';
    borderColor.value = '#000000';
    borderColor.style.marginBottom = '10px';

    const bgColor = document.createElement('input');
    bgColor.type = 'color';
    bgColor.value = this.options.defaultBackground;
    bgColor.style.marginBottom = '10px';

    const hAlign = document.createElement('select');
    ['left', 'center', 'right'].forEach(align => {
      const option = document.createElement('option');
      option.value = align;
      option.textContent = align;
      hAlign.appendChild(option);
    });
    hAlign.style.marginBottom = '10px';
    hAlign.style.width = '100%';

    const vAlign = document.createElement('select');
    ['top', 'middle', 'bottom'].forEach(align => {
      const option = document.createElement('option');
      option.value = align;
      option.textContent = align;
      vAlign.appendChild(option);
    });
    vAlign.style.marginBottom = '10px';
    vAlign.style.width = '100%';

    const mergeBtn = document.createElement('button');
    mergeBtn.textContent = 'Merge Cells';
    mergeBtn.style.padding = '5px 10px';
    mergeBtn.addEventListener('click', () => this.mergeCells(cell));

    const splitBtn = document.createElement('button');
    splitBtn.textContent = 'Split Cell';
    splitBtn.style.padding = '5px 10px';
    splitBtn.addEventListener('click', () => this.splitCell(cell));

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.style.padding = '5px 10px';
    applyBtn.addEventListener('click', () => {
      cell.style.border = `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`;
      cell.style.backgroundColor = bgColor.value;
      cell.style.textAlign = hAlign.value;
      cell.style.verticalAlign = vAlign.value;
      dialog.remove();
    });

    dialog.append(
      borderStyle,
      borderWidth,
      borderColor,
      bgColor,
      hAlign,
      vAlign,
      mergeBtn,
      splitBtn,
      applyBtn
    );
    document.body.appendChild(dialog);
  }

  private mergeCells(_cell: HTMLTableCellElement): void {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const selectedCells = Array.from(
      this.editor
        .getToolbar()
        ?.querySelectorAll('td[contenteditable="true"]') || []
    );
    if (selectedCells.length > 1) {
      const firstCell = selectedCells[0] as HTMLTableCellElement;
      selectedCells.slice(1).forEach(c => {
        firstCell.textContent += ' ' + c.textContent;
        c.remove();
      });
      firstCell.colSpan = selectedCells.length;
    }
  }

  private splitCell(cell: HTMLTableCellElement): void {
    const table = cell.closest('table');
    const row = cell.parentElement;
    if (!table || !row) return;
    const newCell = document.createElement('td');
    newCell.style.border = cell.style.border;
    newCell.style.padding = '8px';
    row.insertBefore(newCell, cell.nextSibling);
    cell.colSpan = 1;
  }
}
