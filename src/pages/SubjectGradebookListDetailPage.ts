import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export interface DxColumn {
  dataField: string;
  caption: string;
  ownerBand?: number;
}

export class SubjectGradebookListDetailPage extends BasePage {
  readonly scoreGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.scoreGrid = page.locator('.ant-table-body table').first();
  }

  // ── Column helpers ───────────────────────────────────────────────────────

  /**
   * Returns columns from the last thead row (leaf columns).
   * dataField = caption text (used as column identifier in this table).
   */
  async getVisibleColumns(): Promise<DxColumn[]> {
    return this.scoreGrid.evaluate((table) => {
      const rows = table.querySelectorAll('thead tr');
      const lastRow = rows[rows.length - 1];
      if (!lastRow) return [];
      return Array.from(lastRow.querySelectorAll('th'))
        .map(th => ({ dataField: th.textContent?.trim() ?? '', caption: th.textContent?.trim() ?? '' }))
        .filter(col => col.caption !== '');
    });
  }

  /**
   * Find the column index (0-based) in the last header row by caption text.
   * Returns -1 if not found.
   */
  private async _findColIndex(caption: string): Promise<number> {
    return this.scoreGrid.evaluate((table, cap) => {
      const rows = table.querySelectorAll('thead tr');
      const lastRow = rows[rows.length - 1];
      if (!lastRow) return -1;
      return Array.from(lastRow.querySelectorAll('th'))
        .findIndex(th => th.textContent?.trim() === cap);
    }, caption);
  }

  // ── Cell interaction ──────────────────────────────────────────────────────

  /**
   * Click the cell at (rowIndex, dataField) to enter edit mode.
   * rowIndex is 0-based; dataField is the column caption text.
   */
  async clickCell(rowIndex: number, dataField: string): Promise<void> {
    const colIndex = await this._findColIndex(dataField);
    if (colIndex < 0) throw new Error(`Column "${dataField}" not found in table header`);
    await this.scoreGrid.locator('tbody tr').nth(rowIndex).locator('td').nth(colIndex).click();
  }

  /** The active input inside an editable cell. */
  get activeCellInput(): Locator {
    return this.scoreGrid.locator('tbody td input, tbody td .ant-input-number-input').first();
  }

  /**
   * Read the displayed text value of a cell.
   * rowIndex is 0-based; dataField is the column caption text.
   */
  async readCellValue(rowIndex: number, dataField: string): Promise<string> {
    const colIndex = await this._findColIndex(dataField);
    if (colIndex < 0) return '';
    const cell = this.scoreGrid.locator('tbody tr').nth(rowIndex).locator('td').nth(colIndex);
    return ((await cell.textContent()) ?? '').trim();
  }

  /** Total visible data row count. */
  async getRowCount(): Promise<number> {
    return this.scoreGrid.locator('tbody tr').count();
  }

  // ── DOM-based locators ────────────────────────────────────────────────────

  get dataRows(): Locator {
    return this.scoreGrid.locator('tbody tr');
  }

  /** Band/group header cell for a semester label (e.g., "Học kỳ 1"). */
  semesterBandHeader(semesterLabel: string): Locator {
    return this.scoreGrid.locator(`thead th:has-text("${semesterLabel}")`).first();
  }
}
