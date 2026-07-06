import { Page, Locator, expect } from '@playwright/test';
import { SubjectGradebookScoreAndCommentPage } from '../pages/SubjectGradebookScoreAndCommentPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';
import { randomScore, EXCLUDED_SCORE_COLUMN_CAPTIONS } from '../constants/SubjectGradebookScoreAndCommentConstants';


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
  async selectSemester(semester: string): Promise<void> {
    const semesterInput = this.listPage.semesterInput;
    await this.listPage.waitForElement(semesterInput, TIMEOUTS.MEDIUM);
    await semesterInput.click();
    await this.page.waitForTimeout(300);
    const semesterItem = this.listPage.semesterDropdownItem(semester);
    await this.listPage.waitForElement(semesterItem, TIMEOUTS.MEDIUM);
    await semesterItem.click();
    await this.page.waitForTimeout(300);
    this.logger.info(`Đã chọn học kỳ: "${semester}"`);
  }

  async selectCourse(className: string, courseName: string): Promise<void> {
    this.logger.step(`Chọn khóa học: "${courseName}"`);

    // if (subjectName) {
    //   // const subjectInput = this.listPage.subjectInput;
    //   // await this.listPage.waitForElement(subjectInput, TIMEOUTS.MEDIUM);
    //   // await subjectInput.click();
    //   // await this.page.waitForTimeout(300);
    //   // const subjectItem = this.listPage.subjectDropdownItem(subjectName);
    //   // await this.listPage.waitForElement(subjectItem, TIMEOUTS.MEDIUM);
    //   // await subjectItem.click();
    //   // await this.page.waitForTimeout(300);
    //   // this.logger.info(`Đã chọn môn: "${subjectName}"`);
    // }

    const courseInput = this.listPage.courseInput;
    await this.listPage.waitForElement(courseInput, TIMEOUTS.MEDIUM);
    await courseInput.click();
    await courseInput.selectText();
    await courseInput.pressSequentially(className, { delay: 50 });
    await this.page.waitForTimeout(600);

    const targetItem = this.listPage.courseDropdownItem(courseName);
    await this.listPage.waitForElement(targetItem, TIMEOUTS.MEDIUM);
    await targetItem.scrollIntoViewIfNeeded();
    await targetItem.click();

    this.logger.info(`Đã chọn: "${courseName}"`);
  }

  async getAvailableCourses(className: string): Promise<string[]> {
    this.logger.step(`Lấy danh sách course chứa "${className}"`);
    const courseInput = this.listPage.courseInput;
    await this.listPage.waitForElement(courseInput, TIMEOUTS.MEDIUM);
    await courseInput.click();
    await courseInput.selectText();
    await courseInput.pressSequentially(className, { delay: 50 });
    await this.page.waitForTimeout(600);

    const items = this.listPage.dropdownItems();
    await items.first().waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    const count = await items.count();
    const courses: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await items.nth(i).textContent()) ?? '').trim();
      if (text) courses.push(text);
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
    this.logger.info(`Tìm thấy ${courses.length} course: ${courses.join(', ')}`);
    return courses;
  }

  async getAvailableSemesters(): Promise<string[]> {
    this.logger.step('Lấy danh sách semester');
    const semesterInput = this.listPage.semesterInput;
    await this.listPage.waitForElement(semesterInput, TIMEOUTS.MEDIUM);
    await semesterInput.click();
    await this.page.waitForTimeout(300);

    const ariaOwns = await semesterInput.getAttribute('aria-owns');
    const listContainer = this.page.locator(`#${ariaOwns}`);
    const items = listContainer.locator('.dx-list-item');
    await items.first().waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    const count = await items.count();
    const semesters: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = ((await items.nth(i).textContent()) ?? '').trim();
      if (text) semesters.push(text);
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
    this.logger.info(`Tìm thấy ${semesters.length} semester: ${semesters.join(', ')}`);
    return semesters;
  }

  /**
   * Kiểm tra trang nhập điểm đã hiện và có ít nhất 1 học sinh.
   */
  async assertStudentListVisible(): Promise<void> {
    this.logger.step('Kiểm tra danh sách học sinh hiện ra');
    await this.listPage.waitForElement(this.listPage.scoreGrid, TIMEOUTS.LONG);
    const rowCount = await this.listPage.getRowCount();
    expect(
      rowCount,
      `Bảng điểm phải có hơn 0 học sinh (tìm thấy ${rowCount})`
    ).toBeGreaterThan(0);
    this.logger.info(`Bảng điểm có ${rowCount} học sinh`);
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

      if (await td.locator('dx-select-box').count() > 0) {
        type = 'dropdown';
        const selectInput = td.locator('input.dx-texteditor-input').first();
        const ariaOwns = await selectInput.getAttribute('aria-owns');
        const items = this.page.locator(`#${ariaOwns} .dx-list-item`);
        await items.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
        const itemCount = await items.count();
        const rangeLetterName: string[] = [];
        for (let i = 0; i < itemCount; i++) {
          const text = ((await items.nth(i).textContent()) ?? '').trim();
          if (text) rangeLetterName.push(text);
        }
        this.logger.info(`Cột "${colName}" - danh sách dropdown: ${rangeLetterName.join(', ')}`);
      }
      else if (await td.locator('dx-number-box').count() > 0)  type = 'number input';
    } finally {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(200);
    }
    return type;
  }

  private async deleteColumnScores(colName: string): Promise<void> {
    const ths = this.listPage.headerThs();
    const count = await ths.count();
    let th: Locator | null = null;
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = await (await container.count() > 0 ? container : ths.nth(i)).textContent();
      if ((text ?? '').trim() === colName) { th = ths.nth(i); break; }
    }
    if (!th) return;

    const trigger = this.listPage.columnMenuTrigger(th);
    if (await trigger.count() === 0) return;
    await trigger.click();

    const deleteItem = this.listPage.deleteScoresMenuItem();
    await deleteItem.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await deleteItem.click();

    const confirmYesBtn = this.listPage.deleteScoresConfirmYesBtn();
    await confirmYesBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await confirmYesBtn.click();
    await this.page.waitForTimeout(300);
  }

  private async deleteColumnComment(colName: string): Promise<void> {
    const ths = this.listPage.headerThs();
    const count = await ths.count();
    let th: Locator | null = null;
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = await (await container.count() > 0 ? container : ths.nth(i)).textContent();
      if ((text ?? '').trim() === colName) { th = ths.nth(i); break; }
    }
    if (!th) return;

    const trigger = this.listPage.columnMenuTrigger(th);
    if (await trigger.count() === 0) return;
    await trigger.click();

    const deleteItem = this.listPage.deleteCommentsMenuItem();
    await deleteItem.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await deleteItem.click();

    const confirmYesBtn = this.listPage.deleteScoresConfirmYesBtn();
    await confirmYesBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    await confirmYesBtn.click();
    await this.page.waitForTimeout(300);
  }

  async enterScoresByColumnType(): Promise<void> {
    const cols = await this.getScoreInputColumns();
    const rowCount = await this.listPage.getRowCount();
    this.logger.step(`Nhập điểm cho ${rowCount} HS, ${cols.length} cột: ${cols.join(', ')}`);

    const commentCols: string[] = [];

    for (const col of cols) {
      // chổ này kiểm tra type của cột để quyết định cách nhập điểm: number input / dropdown / comment
      // nên khi run sẽ thấy click hai lần => ok ko sao
      const colType = await this.detectCellTypeAtColumn(col);
      this.logger.info(`Cột "${col}" → type: "${colType}"`);

      if (colType === 'comment') {
        commentCols.push(col);
        continue;
      }
      else{ // if else để tránh trường hợp xóa nhằm cột commnent
        await this.deleteColumnScores(col);
        for (let row = 0; row < rowCount; row++) {
          const studentName = await this.listPage.getStudentNameAt(row);
          this.logger.info(`  Hàng ${row} (${studentName || 'không rõ tên'})`);
          if (colType === 'number input')  await this.enterScoreCell(row, col);
          else if (colType === 'dropdown') await this.enterDropdownCell(row, col);
          else this.logger.warn(`Cột "${col}" hàng ${row}: type không xác định, bỏ qua`);
        }
      }
    }
    this.logger.step('Lưu dữ liệu');
    await this.listPage.saveBtn.click();
    await this.listPage.saveSuccessToast().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

    if (commentCols.length === 0) return;

    this.logger.step(`Nhập comment cho ${commentCols.length} cột: ${commentCols.join(', ')}`);
    for (const col of commentCols) {
      await this.deleteColumnComment(col);
      await this.enterCommentColumn(col);
    }
  }

  /**
   * Chỉ nhập điểm số/dropdown cho các HS chỉ định theo mã HS, bỏ qua cột comment.
   * Dùng khi test công thức tính HK1/HK2/CN, không cần nhập nhận xét.
   */
  async enterNumericScoresForStudents(studentCodes: string[]): Promise<void> {
    const cols = await this.getScoreInputColumns();
    const rowCount = await this.listPage.getRowCount();

    const rows: number[] = [];
    for (let row = 0; row < rowCount; row++) {
      const code = await this.listPage.getStudentCodeAt(row);
      if (studentCodes.includes(code)) rows.push(row);
    }
    this.logger.step(`Nhập điểm cho ${rows.length}/${rowCount} HS (${studentCodes.join(', ')}), ${cols.length} cột: ${cols.join(', ')}`);

    for (const col of cols) {
      const colType = await this.detectCellTypeAtColumn(col);
      this.logger.info(`Cột "${col}" → type: "${colType}"`);
      if (colType === 'comment') continue;

      await this.deleteColumnScores(col);
      for (const row of rows) {
        const studentCode = await this.listPage.getStudentCodeAt(row);
        this.logger.info(`  Hàng ${row} (${studentCode})`);
        if (colType === 'number input')  await this.enterScoreCell(row, col);
        else if (colType === 'dropdown') await this.enterDropdownCell(row, col);
        else this.logger.warn(`Cột "${col}" hàng ${row}: type không xác định, bỏ qua`);
      }
    }

    this.logger.step('Lưu dữ liệu');
    await this.listPage.saveBtn.click();
    await this.listPage.saveSuccessToast().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
  }

  // ── Score/comment entry ────────────────────────────────────────────────

  private async getScoreInputColumns(): Promise<string[]> {
    // scoreColumnThs() = th:has(app-grid-header-container) — chỉ chứa cột điểm
    const ths = this.listPage.scoreColumnThs();
    await ths.first().waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    // đợi số cột ổn định (tránh đọc nhầm lúc bảng đang re-render khi đổi course)
    let count = await ths.count();
    for (let i = 0; i < 10; i++) {
      await this.page.waitForTimeout(200);
      const newCount = await ths.count();
      if (newCount === count) break;
      count = newCount;
    }

    const cols: string[] = [];
    for (let i = 0; i < count; i++) {
      const container = ths.nth(i).locator('app-grid-header-container');
      const text = ((await (await container.count() > 0 ? container : ths.nth(i)).textContent()) ?? '').trim();
      if (text && !(EXCLUDED_SCORE_COLUMN_CAPTIONS as readonly string[]).includes(text)) cols.push(text);
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
    const selectInput = cell.locator('input.dx-texteditor-input').first();
    const ariaOwns = await selectInput.getAttribute('aria-owns');
    const items = this.page.locator(`#${ariaOwns} .dx-list-item`);
    await items.first().waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
    const itemCount = await items.count();
    const rangeLetterName: string[] = [];
    for (let i = 0; i < itemCount; i++) {
      const text = ((await items.nth(i).textContent()) ?? '').trim();
      if (text) rangeLetterName.push(text);
    }

    const targetValue = rangeLetterName.find(v => v === 'Đạt' || v === 'Hoàn thành tốt');
    if (!targetValue) {
      this.logger.warn(`Cột "${col}" hàng ${row}: không tìm thấy "Đạt"/"Hoàn thành tốt" trong danh sách (${rangeLetterName.join(', ')})`);
      await this.page.keyboard.press('Escape');
      return;
    }

    const opt = items.filter({ hasText: new RegExp(`^${targetValue}$`) }).first();
    await opt.click({ force: true });
    await this.page.waitForTimeout(200);
  }

  private async enterCommentColumn(col: string): Promise<void> {
    const firstCell = await this.listPage.getCommentCell(0, col);
    if (!firstCell) return;

    const icon = firstCell.locator('i.fa-comment').first();
    if (await icon.count() === 0) {
      this.logger.warn(`Cột "${col}": không tìm thấy i.fa-comment`);
      return;
    }
    await icon.click();

    const popup = this.listPage.commentPopup();
    await popup.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });

    while (true) {
      const codeBefore = await this.listPage.getCommentPopupStudentCode();
      this.logger.info(`  Comment HS: ${codeBefore}`);

      await expect(this.listPage.commentPopupTextarea()).toBeEditable({ timeout: TIMEOUTS.MEDIUM }); // để đây để đảm bảo textarea visibale cho nhập data
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      await this.listPage.commentPopupTextarea().fill(`${dd}/${mm}/${yyyy} ${hh}:${min} NX vua dc cap nhật`);

      await this.listPage.commentPopupSaveAndNextBtn().click();

      await expect(this.listPage.commentPopupSaveAndNextBtn()).not.toHaveClass(/dx-state-disabled/, { timeout: TIMEOUTS.LONG });
      
      await this.page.waitForTimeout(1000);

      const codeAfter = await this.listPage.getCommentPopupStudentCode();
      if (codeAfter === codeBefore) {
        await this.listPage.commentPopupCloseBtn().click();
        break;
      }
    }
  }


}
