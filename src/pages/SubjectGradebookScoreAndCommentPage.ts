import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradebookScoreAndCommentPage extends BasePage {
  readonly listGrid: Locator;
  readonly courseInput: Locator;
  readonly subjectInput: Locator;
  readonly semesterInput: Locator;
  readonly scoreGrid: Locator;

  constructor(page: Page) {
    super(page);

    this.listGrid = page.locator('.dx-datagrid, .ant-table, [class*="grid"], [class*="table"]').first();
    this.courseInput = page.locator('dx-select-box input[aria-required="true"]').first();
    this.subjectInput = page.locator('dx-select-box').filter({ hasNot: page.locator('input[aria-required="true"]') }).locator('input.dx-texteditor-input').first();
    this.semesterInput = page.locator('dx-select-box').nth(2).locator('input.dx-texteditor-input');
    this.scoreGrid = page.locator('table:has(td:not(.nz-disable-td) app-score-edit)').first();
  }

  // ── Dynamic locators ─────────────────────────────────────────────────────

  dropdownItems(): Locator {
    return this.page.locator('.dx-list-item');
  }

  semesterDropdownItem(value: string): Locator {
    return this.page.locator('.dx-list-item').filter({ hasText: value }).first();
  }

  subjectDropdownItem(value: string): Locator {
    return this.page.locator('.dx-list-item').filter({ hasText: value }).first();
  }

  courseDropdownItem(keyword: string): Locator {
    return this.page
      .locator('.dx-list-item')
      .filter({ hasText: new RegExp(`^${keyword}`, 'i') })
      .first();
  }

  courseDropdownButton(): Locator {
    return this.page.locator('.dx-field-item.dxo-label-red .dx-dropdowneditor-button');
  }

  courseOverlayItems(): Locator {
    return this.page.locator('body > .dx-overlay-wrapper.dx-dropdowneditor-overlay .dx-list-item');
  }

  courseOverlayItem(keyword: string): Locator {
    return this.courseOverlayItems().filter({ hasText: new RegExp(`^${keyword}`, 'i') }).first();
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
      .nth(colIndex);
  }

  async getStudentNameAt(rowIndex: number): Promise<string> {
    const nameCell = this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(rowIndex)
      .locator('td')
      .nth(1);
    return (await nameCell.textContent() ?? '').trim();
  }

  async getStudentCodeAt(rowIndex: number): Promise<string> {
    const codeCell = this.scoreGrid
      .locator('tbody tr.ant-table-row')
      .nth(rowIndex)
      .locator('td')
      .nth(2);
    return (await codeCell.textContent() ?? '').trim();
  }

  async clickCell(rowIndex: number, colCaption: string): Promise<void> {
    const cell = await this.getCell(rowIndex, colCaption);
    if (!cell) throw new Error(`Column "${colCaption}" not found`);
    await cell.click();
  }

  async getRowCount(): Promise<number> {
    return this.scoreGrid.locator('tbody tr.ant-table-row').count();
  }

  // ── Comment popup locators ───────────────────────────────────────────────

  commentPopup(): Locator {
    return this.page.locator('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').first();
  }

  commentPopupTextarea(): Locator {
    return this.commentPopup().locator('textarea').first();
  }

  // ── Column header "Delete scores" menu ───────────────────────────────────

  columnMenuTrigger(th: Locator): Locator {
    return th.locator('span.ant-dropdown-trigger i.fa-chevron-circle-down');
  }

  deleteScoresMenuItem(): Locator {
    return this.page.locator('li.ant-dropdown-menu-item').filter({ hasText: 'Delete scores' });
  }

  deleteScoresConfirmYesBtn(): Locator {
    return this.page.locator('abp-confirmation button#confirm');
  }

  deleteCommentsMenuItem(): Locator {
    return this.page.locator('li.ant-dropdown-menu-item').filter({ hasText: 'Delete comments' });
  }

  get saveBtn(): Locator {
    return this.page.locator('dx-button[aria-label="Save"]');
  }

  saveSuccessToast(): Locator {
    return this.page.locator('.abp-toast-success .abp-toast-message').filter({ hasText: 'Saved scores successfully' });
  }

  commentPopupSaveAndNextBtn(): Locator {
    return this.page.locator('dx-button[aria-label="Save and move to next student"]');
  }

  commentPopupCloseBtn(): Locator {
    return this.commentPopup().locator('dx-button[aria-label="Close"]').first(); // là nút close và dấu X ở góc popup, hiện lấy dấu X
  }

  async getCommentPopupStudentCode(): Promise<string> {
    const text = await this.commentPopup().locator('.card-primary').textContent() ?? '';
    const match = text.match(/Student code[:\s]+(\S+?)(?=\s*Class)/);
    return match?.[1] ?? '';
  }

}
