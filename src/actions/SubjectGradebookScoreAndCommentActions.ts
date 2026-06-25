import { Page, expect } from '@playwright/test';
import { SubjectGradebookScoreAndCommentPage } from '../pages/SubjectGradebookScoreAndCommentPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';
import { randomScore } from '../constants/SubjectGradebookScoreAndCommentConstants';

export type SubjectType = 'score' | 'dropdown' | 'comment' | 'none_type_found';

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
    this.logger.info(`Bảng điểm có ${trCount} thẻ tr ✓`);
  }

  // ── Subject type detection ───────────────────────────────────────────────

  // Tìm colName trong headerThs() để lấy absolute index, rồi check TD tương ứng trong body
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
    if (await td.locator('dx-select-box').count() > 0)                    return 'dropdown';
    if (await td.locator('dx-number-box').count() > 0)                    return 'number input';
    if (await td.locator('i.fa-comment, app-comment-view').count() > 0)   return 'comment';
    return 'none_type_found';
  }

  async detectSubjectTypeFromGrid(): Promise<SubjectType> {
    this.logger.step('Kiểm tra loại Sổ điểm');
    const cols = await this.getScoreInputColumns();
    this.logger.step(`scoreColumnThs count: ${cols}`);

    const tx1Col = cols.find(c => c === 'TX1') ?? null;
    if (!tx1Col) {
      this.logger.warn(`Không tìm thấy cột TX1 trong: ${cols.join(', ')}`);
      return 'none_type_found';
    }
    const cellType = await this.detectCellTypeAtColumn(tx1Col);
    const type: SubjectType = cellType === 'dropdown'     ? 'dropdown'
                            : cellType === 'comment'      ? 'comment'
                            : cellType === 'number input' ? 'score'
                            : 'none_type_found';
    this.logger.info(`Cột "${tx1Col}" cellType="${cellType}" → subjectType="${type}"`);
    return type;
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

  /**
   * Nhập giá trị cho toàn bộ học sinh (tất cả các hàng) tùy loại môn:
   *   score    → nhập điểm số ngẫu nhiên (4–10)
   *   dropdown → chọn "Đạt" từ dx-select-box
   *   comment  → nhập text "nx tốt" vào textarea
   */
  async enterScoresByType(subjectType: SubjectType): Promise<void> {
    const cols = await this.getScoreInputColumns();
    const rowCount = await this.listPage.getRowCount();
    this.logger.step(`Nhập "${subjectType}" cho ${rowCount} HS, ${cols.length} cột: ${cols.join(', ')}`);

    for (let row = 0; row < rowCount; row++) {
      for (const col of cols) {
        if (subjectType === 'score')         await this.enterScoreCell(row, col);
        else if (subjectType === 'dropdown') await this.enterDropdownCell(row, col);
        else                                 await this.enterCommentCell(row, col);
      }
    }
  }

  private async enterScoreCell(row: number, col: string): Promise<void> {
    await this.listPage.clickCell(row, col);
    await this.listPage.waitForElement(this.listPage.activeCellInput, TIMEOUTS.SHORT);
    await this.listPage.activeCellInput.fill(String(randomScore()));
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
    const cell = await this.listPage.getCell(row, col);
    if (!cell) return;
    await cell.click();
    await this.page.waitForTimeout(300);
    const textarea = cell.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('nx tốt');
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(150);
    } else {
      this.logger.warn(`Hàng ${row} cột "${col}": không có textarea`);
    }
  }


}
