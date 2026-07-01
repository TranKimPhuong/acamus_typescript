import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradebookScoreAndCommentPage extends BasePage {
  readonly listGrid: Locator;
  readonly courseInput: Locator;
  readonly scoreGrid: Locator;

  constructor(page: Page) {
    super(page);

    this.listGrid = page.locator('.dx-datagrid, .ant-table, [class*="grid"], [class*="table"]').first();
    this.courseInput = page.locator('dx-select-box input[aria-required="true"]').first();
    this.scoreGrid = page.locator('table:has(td:not(.nz-disable-td) app-score-edit)').first();
  }

  // ── Dynamic locators ─────────────────────────────────────────────────────

  courseDropdownItem(keyword: string): Locator {
    return this.page
      .locator('.dx-list-item')
      .filter({ hasText: new RegExp(`^${keyword}`, 'i') })
      .first();
  }

  rowsContaining(className: string): Locator {
    return this.page.locator(
      `.dx-data-row:has-text("${className}"), ` +
      `tbody tr:has-text("${className}")`
    );
  }

  nthRowContaining(className: string, index: number): Locator {
    return this.rowsContaining(className).nth(index);
  }

  openScoreEntryButton(rowLocator: Locator): Locator {
    return rowLocator.locator(
      'a.link-opacity-100, a[href*="subject-score"], button:has-text("Nhập điểm"), ' +
      'button:has-text("Mở"), td a'
    ).first();
  }

  // ── Score grid locators ──────────────────────────────────────────────────

  // Tất cả TH trong cùng row với score columns — dùng để tính absolute index → map sang TD
  headerThs(): Locator {
    return this.page.locator('tr:has(th:has(app-grid-header-container)) th');
  }

  // Chỉ TH cột điểm (có chứa app-grid-header-container) — dùng để lấy danh sách tên cột nhập điểm
  scoreColumnThs(): Locator {
    return this.page.locator('th:has(app-grid-header-container)');
  }

  // colIndex = absolute index from headerThs()
  firstRowCellAt(colIndex: number): Locator {
    return this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(0)
      .locator('td')
      .nth(colIndex);
  }

  get activeCellInput(): Locator {
    return this.scoreGrid
      .locator('tbody td input:not([type="hidden"]), tbody td .ant-input-number-input')
      .first();
  }

  // Returns absolute index from headerThs() — aligns with td.nth(index) in main body table
  private async findColIndex(colCaption: string): Promise<number> {
    const ths = this.headerThs();
    const count = await ths.count();
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = await (await container.count() > 0 ? container : ths.nth(i)).textContent();
      if ((text ?? '').trim() === colCaption) return i;
    }
    return -1;
  }

  async getCell(rowIndex: number, colCaption: string): Promise<Locator | null> {
    const colIndex = await this.findColIndex(colCaption);
    if (colIndex < 0) return null;
    return this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(rowIndex)
      .locator('td')
      .nth(colIndex);
  }

  // Comment columns in body have +1 offset vs header TH index (extra expand TD in main table)
  async getCommentCell(rowIndex: number, colCaption: string): Promise<Locator | null> {
    const colIndex = await this.findColIndex(colCaption);
    if (colIndex < 0) return null;
    return this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(rowIndex)
      .locator('td')
      .nth(colIndex + 1);
  }

  async getStudentNameAt(rowIndex: number): Promise<string> {
    const nameCell = this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(rowIndex)
      .locator('td')
      .nth(1);
    return (await nameCell.textContent() ?? '').trim();
  }

  async clickCell(rowIndex: number, colCaption: string): Promise<void> {
    const cell = await this.getCell(rowIndex, colCaption);
    if (!cell) throw new Error(`Column "${colCaption}" not found`);
    await cell.click();
  }

  async getRowCount(): Promise<number> {
    return this.scoreGrid.locator('tbody tr.ant-table-row').count();
  }

}
