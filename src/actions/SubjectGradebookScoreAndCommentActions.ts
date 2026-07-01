import { Page, expect } from '@playwright/test';
import { SubjectGradebookScoreAndCommentPage } from '../pages/SubjectGradebookScoreAndCommentPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';
import { randomScore } from '../constants/SubjectGradebookScoreAndCommentConstants';


export class SubjectGradebookScoreAndCommentActions {
  private page: Page;
  private listPage: SubjectGradebookScoreAndCommentPage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new SubjectGradebookScoreAndCommentPage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('SubjectGradebookScoreAndCommentActions');
  }

  /**
   * Chọn khóa học theo tên lớp + tên môn học, mở trang nhập điểm.
   * Nhập className vào dx-select-box thứ 2, chọn item bắt đầu bằng "{subjectName} {className}".
   */
  async selectCourse(className: string, subjectName: string): Promise<void> {
    this.logger.step(`Chọn khóa học: lớp "${className}" - môn "${subjectName}"`);

    const courseInput = this.listPage.courseInput;
    await this.listPage.waitForElement(courseInput, TIMEOUTS.MEDIUM);
    await courseInput.click();
    await courseInput.selectText();
    await courseInput.pressSequentially(className, { delay: 50 });
    await this.page.waitForTimeout(600);

    const keyword = `${subjectName} ${className}`;
    const targetItem = this.listPage.courseDropdownItem(keyword);
    await this.listPage.waitForElement(targetItem, TIMEOUTS.MEDIUM);
    await targetItem.scrollIntoViewIfNeeded();
    await targetItem.click();

    this.logger.info(`Đã chọn: "${keyword}"`);
  }

  /**
   * Kiểm tra trang nhập điểm đã hiện và có ít nhất 1 học sinh.
   */
  async assertStudentListVisible(): Promise<void> {
    this.logger.step('Kiểm tra danh sách học sinh hiện ra');
    await this.listPage.waitForElement(this.listPage.scoreGrid, TIMEOUTS.LONG);
    const trCount = await this.listPage.scoreGrid.locator('tr').count();
    expect(
      trCount,
      `Bảng điểm phải có hơn 0 thẻ tr (tìm thấy ${trCount})`
    ).toBeGreaterThan(0);
    this.logger.info(`Bảng điểm có ${trCount} học sinh`);
  }

  // ── Subject type detection ───────────────────────────────────────────────

  private async detectCellTypeAtColumn(colName: string): Promise<string> {
    const ths = this.listPage.headerThs();
    const count = await ths.count();
    let colIndex = -1;
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = await (await container.count() > 0 ? container : ths.nth(i)).textContent();
      if ((text ?? '').trim() === colName) { colIndex = i; break; }
    }
    if (colIndex < 0) return 'none_type_found';

    const td = this.listPage.firstRowCellAt(colIndex);

    // app-comment-view luôn hiện trong cell mà ko cần click → detect ngay
    if (await td.locator('app-comment-view').count() > 0) return 'comment';

    // score / dropdown: phải click để Angular render input widget
    let type = 'none_type_found';
    try {
      await td.scrollIntoViewIfNeeded();
      await td.click({ force: true });
      await this.page.waitForTimeout(400);

      if (await td.locator('dx-select-box').count() > 0)       type = 'dropdown';
      else if (await td.locator('dx-number-box').count() > 0)  type = 'number input';
    } finally {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(200);
    }
    return type;
  }

  async enterScoresByColumnType(): Promise<void> {
    const cols = await this.getScoreInputColumns();
    const rowCount = await this.listPage.getRowCount();
    this.logger.step(`Nhập điểm cho ${rowCount} HS, ${cols.length} cột: ${cols.join(', ')}`);

    for (const col of cols) {
      const colType = await this.detectCellTypeAtColumn(col);
      this.logger.info(`Cột "${col}" → type: "${colType}"`);

      for (let row = 0; row < rowCount; row++) {
        const studentName = await this.listPage.getStudentNameAt(row);
        this.logger.info(`  Hàng ${row} (${studentName || 'không rõ tên'})`);
        if (colType === 'number input')  await this.enterScoreCell(row, col);
        else if (colType === 'dropdown') await this.enterDropdownCell(row, col);
        else if (colType === 'comment')  await this.enterCommentCell(row, col);
        else this.logger.warn(`Cột "${col}" hàng ${row}: type không xác định, bỏ qua`);
      }
    }
  }

  // ── Score/comment entry ────────────────────────────────────────────────

  private async getScoreInputColumns(): Promise<string[]> {
    // scoreColumnThs() = th:has(app-grid-header-container) — chỉ chứa cột điểm
    const ths = this.listPage.scoreColumnThs();
    await ths.first().waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    const count = await ths.count();

    //this.logger.step(`scoreColumnThs count: ${count}`);

    const cols: string[] = [];
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = ((await (await container.count() > 0 ? container : ths.nth(i)).textContent()) ?? '').trim();
      if (text) cols.push(text);
    }
    return cols;
  }

  private async enterScoreCell(row: number, col: string): Promise<void> {
    const cell = await this.listPage.getCell(row, col);
    if (!cell) throw new Error(`Column "${col}" not found`);
    await cell.click();
    const input = cell.locator('input:not([type="hidden"])').first();
    await this.listPage.waitForElement(input, TIMEOUTS.SHORT);
    await input.fill(String(randomScore()));
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(150);
  }

  private async enterDropdownCell(row: number, col: string): Promise<void> {
    const cell = await this.listPage.getCell(row, col);
    if (!cell) return;
    await cell.click();
    await this.page.waitForTimeout(300);
    await cell.locator('dx-select-box').first().click();
    await this.page.waitForTimeout(300);
    const opt = this.page.locator('.dx-list-item').filter({ hasText: /^Đạt$/ }).first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click();
      await this.page.waitForTimeout(200);
    } else {
      this.logger.warn(`Hàng ${row} cột "${col}": không hiện "Đạt"`);
      await this.page.keyboard.press('Escape');
    }
  }

  private async enterCommentCell(row: number, col: string): Promise<void> {
    const cell = await this.listPage.getCommentCell(row, col);
    if (!cell) return;

    const gridCommand = cell.locator('a.grid-command').first();
    await gridCommand.scrollIntoViewIfNeeded();
    await gridCommand.click();
    await this.page.waitForTimeout(300);

    let textarea = cell.locator('textarea').first();
    if (await textarea.count() === 0) {
      textarea = this.page.locator('textarea').first();
    }

    if (await textarea.count() > 0) {
      await textarea.fill('nx tốt');
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(150);
    } else {
      this.logger.warn(`Hàng ${row} cột "${col}": không có textarea`);
    }
  }


}
