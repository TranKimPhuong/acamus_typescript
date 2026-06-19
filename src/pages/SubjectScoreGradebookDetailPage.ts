import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

// Typed structure returned from the DevExtreme API call
export interface DxColumn {
  dataField: string;
  caption: string;
  ownerBand?: number; // index of parent band column (undefined = top-level)
}

export class SubjectScoreGradebookDetailPage extends BasePage {
  // The DevExtreme DataGrid that contains student scores
  readonly scoreGrid: Locator;

  // Save button — saves all batch-edited cells
  readonly saveButton: Locator;

  // Cancel / discard changes button
  readonly cancelButton: Locator;

  // Toast / snack bar that confirms successful save
  readonly saveSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.scoreGrid = page.locator('.dx-datagrid').first();

    this.saveButton = page.locator(
      'button:has-text("Lưu"), button:has-text("Save"), ' +
      'button[class*="save"]:not([disabled]), .dx-button:has-text("Lưu")'
    ).first();

    this.cancelButton = page.locator(
      'button:has-text("Hủy"), button:has-text("Cancel"), .dx-button:has-text("Hủy")'
    ).first();

    this.saveSuccessMessage = page.locator(
      '.ant-message-success, .dx-toast-success, ' +
      '[class*="success"]:has-text("thành công"), ' +
      '[class*="success"]:has-text("Success")'
    ).first();
  }

  // ── DevExtreme DataGrid helpers ──────────────────────────────────────────

  /**
   * Returns all visible columns of the DataGrid (excluding band columns).
   * Uses the DevExtreme JS API to avoid fragile DOM selectors.
   */
  async getVisibleColumns(): Promise<DxColumn[]> {
    return this.page.evaluate(() => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      if (!el) return [];
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return [];
      return (grid.getVisibleColumns() as any[])
        .map((c: any, idx: number) => ({
          dataField: c.dataField ?? '',
          caption: (c.caption ?? '').toString().trim(),
          ownerBand: c.ownerBand,
          index: idx,
        }))
        .filter((c: any) => c.dataField !== ''); // band-only columns have no dataField
    });
  }

  /**
   * Click on the cell at (rowIndex, dataField) to enter edit mode (batch/cell edit).
   * rowIndex is 0-based.
   */
  async clickCell(rowIndex: number, dataField: string): Promise<void> {
    await this.page.evaluate(([ri, df]) => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (grid) grid.editCell(ri as number, df as string);
    }, [rowIndex, dataField]);
  }

  /**
   * The visible input element inside an editable cell.
   * After editCell() is called, DevExtreme renders an editor inside the focused cell.
   */
  get activeCellInput(): Locator {
    return this.page.locator('.dx-editor-cell .dx-texteditor-input, .dx-editor-cell input').first();
  }

  /**
   * Read the displayed (non-edit) text value of a cell.
   * After saving, DevExtreme renders values in a dx-template-wrapper or plain td text.
   */
  async readCellValue(rowIndex: number, dataField: string): Promise<string> {
    return this.page.evaluate(([ri, df]) => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return '';
      const val = grid.cellValue(ri as number, df as string);
      return val === null || val === undefined ? '' : String(val);
    }, [rowIndex, dataField]);
  }

  /**
   * Get the total row count (visible data rows) via DevExtreme API.
   */
  async getRowCount(): Promise<number> {
    return this.page.evaluate(() => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return 0;
      return grid.totalCount() as number;
    });
  }

  // ── UI-level fallbacks when DevExtreme API is unavailable ────────────────

  /**
   * Returns data rows in the grid (DOM-based fallback).
   * Use getRowCount() via DevExtreme API when possible.
   */
  get dataRows(): Locator {
    return this.page.locator('.dx-datagrid .dx-data-row');
  }

  /**
   * Band column header cell for a semester (e.g., "Học kỳ 1").
   */
  semesterBandHeader(semesterLabel: string): Locator {
    return this.page.locator(
      `.dx-header-row .dx-datagrid-text-content:has-text("${semesterLabel}")`
    ).first();
  }
}
