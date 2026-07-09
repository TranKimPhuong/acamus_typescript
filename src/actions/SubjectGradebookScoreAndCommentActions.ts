import { Page, Locator, expect } from '@playwright/test';
import { SubjectGradebookScoreAndCommentPage } from '../pages/SubjectGradebookScoreAndCommentPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';
import { randomScore, EXCLUDED_SCORE_COLUMN_CAPTIONS, SCORE_COLUMN_WEIGHTS, FINAL_SCORE_COLUMN_WEIGHTS } from '../constants/SubjectGradebookScoreAndCommentConstants';


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
    // "" = xóa filter học kỳ, ko phải chọn item nên bấm nút clear thay vì mở dropdown
    if (semester === '') {
      const clearBtn = this.listPage.semesterClearButton();
      await this.listPage.waitForElement(clearBtn, TIMEOUTS.MEDIUM);
      await clearBtn.click();
      await this.page.waitForTimeout(300);
      this.logger.info('Đã xóa filter học kỳ');
      return;
    }

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
    await this.page.waitForTimeout(600); // đợi lưới load lại dữ liệu sau khi xóa, tránh đè lên điểm cột khác đang nhập dở
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

  async enterScoresByColumnType(excludeCols: string[] = []): Promise<void> {
    const cols = await this.getScoreInputColumns(excludeCols);
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
  async enterNumericScoresForStudents(studentCodes: string[], excludeCols: string[] = []): Promise<Record<string, Record<string, number>>> {
    const cols = await this.getScoreInputColumns(excludeCols);
    const rowCount = await this.listPage.getRowCount();

    const rows: number[] = [];
    const rowByStudent: Record<string, number> = {};
    for (let row = 0; row < rowCount; row++) {
      const code = await this.listPage.getStudentCodeAt(row);
      if (studentCodes.includes(code)) {
        rows.push(row);
        rowByStudent[code] = row;
      }
    }
    this.logger.step(`Nhập điểm cho ${rows.length}/${rowCount} HS (${studentCodes.join(', ')}), ${cols.length} cột: ${cols.join(', ')}`);

    // Xóa data cột HK trước khi nhập điểm mới, để HK được tính lại từ điểm mới thay vì giữ giá trị cũ
    for (const col of excludeCols) {
      await this.deleteColumnScores(col);
    }

    const scoresByStudent: Record<string, Record<string, number>> = {};

    for (const col of cols) {
      const colType = await this.detectCellTypeAtColumn(col);
      this.logger.info(`Cột "${col}" → type: "${colType}"`);
      if (colType === 'comment') continue;

      await this.deleteColumnScores(col);
      for (const row of rows) {
        const studentCode = await this.listPage.getStudentCodeAt(row);
        if (colType === 'number input') {
          const score = await this.enterScoreCell(row, col);
          (scoresByStudent[studentCode] ??= {})[col] = score;
          this.logger.info(`  Hàng ${row} (${studentCode}): cột "${col}" = ${score}`);
        }
        else if (colType === 'dropdown') {
          await this.enterDropdownCell(row, col);
          this.logger.info(`  Hàng ${row} (${studentCode}): cột "${col}" (dropdown)`);
        }
        else this.logger.warn(`Cột "${col}" hàng ${row}: type không xác định, bỏ qua`);
      }
    }

    // Xóa/nhập các cột sau có thể làm mất giá trị cột đã nhập trước đó → nhập bù trước khi Save
    this.logger.step('Xác nhận lại điểm trước khi lưu');
    await this.verifyAndRepairScores(scoresByStudent, rowByStudent);

    // Cột nhập/sửa ngay trước khi bấm Save đôi khi chưa kịp ổn định thì bị mất khi Save → lưu lại nếu vẫn lệch
    for (let saveAttempt = 1; saveAttempt <= 3; saveAttempt++) {
      this.logger.step(`Lưu dữ liệu (lần ${saveAttempt})`);
      await this.listPage.saveBtn.click();
      await this.listPage.saveSuccessToast().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

      const hadMismatch = await this.verifyAndRepairScores(scoresByStudent, rowByStudent);
      if (!hadMismatch) break;
      this.logger.warn('Sau khi lưu vẫn còn điểm bị mất → lưu lại');
    }

    for (const [studentCode, scores] of Object.entries(scoresByStudent)) {
      this.logger.info(`Điểm đã nhập cho HS ${studentCode}: ${JSON.stringify(scores)}`);
    }

    return scoresByStudent;
  }

  /**
   * Đọc lại từng ô theo scoresByStudent, nhập lại nếu lệch so với điểm đã ghi nhận.
   * Lặp tối đa maxPasses lượt vì việc sửa 1 ô đôi khi làm lệch ô khác đã sửa trước đó.
   * Trả về true nếu có ít nhất 1 ô bị lệch (đã được sửa) ở lượt đầu tiên.
   */
  private async verifyAndRepairScores(
    scoresByStudent: Record<string, Record<string, number>>,
    rowByStudent: Record<string, number>,
    maxPasses = 3,
  ): Promise<boolean> {
    let mismatchFound = false;
    for (let pass = 1; pass <= maxPasses; pass++) {
      let fixedAny = false;
      for (const [studentCode, scores] of Object.entries(scoresByStudent)) {
        const row = rowByStudent[studentCode];
        for (const [col, score] of Object.entries(scores)) {
          const cell = await this.listPage.getCell(row, col);
          const currentText = ((await cell?.textContent()) ?? '').trim();
          if (currentText === String(score)) continue;

          mismatchFound = true;
          this.logger.warn(`HS ${studentCode}: cột "${col}" bị mất giá trị (hiện "${currentText}", cần "${score}") → nhập lại (lượt ${pass})`);
          await this.enterScoreCell(row, col, score);
          fixedAny = true;
        }
      }
      if (!fixedAny) break;
    }
    return mismatchFound;
  }

  private async getGridCellText(row: number, col: string): Promise<string> {
    // sau khi Save, cột có thể chưa gắn vào DOM hoặc giá trị tính toán (HK/CN) chưa kịp render
    // → đợi thay vì fail/đọc rỗng ngay; nếu thực sự rỗng thì vẫn trả về "" sau khi hết lượt thử
    let cell: Locator | null = null;
    let text = '';
    for (let attempt = 0; attempt < 10; attempt++) {
      cell = await this.listPage.getCell(row, col);
      if (cell) {
        text = ((await cell.textContent()) ?? '').trim();
        if (text !== '') return text;
      }
      await this.page.waitForTimeout(300);
    }
    if (!cell) throw new Error(`Column "${col}" not found`);
    return text;
  }

  private async getGridCellNumber(row: number, col: string): Promise<{ text: string; value: number }> {
    const text = await this.getGridCellText(row, col);
    return { text, value: parseFloat(text.replace(',', '.')) };
  }

  /**
   * UI có thể làm tròn giá trị hiển thị (vd "7.7" → "8"), nên làm tròn expected theo đúng
   * số chữ số thập phân của actualText trước khi so sánh, thay vì so lệch cố định.
   */
  private assertGridScoreEquals(label: string, actualText: string, actual: number, expected: number): void {
    const decimals = actualText.replace(',', '.').split('.')[1]?.length ?? 0;
    const expectedRounded = Number(expected.toFixed(decimals));
    this.logger.info(`${label}: thực tế=${actualText}, kỳ vọng=${expectedRounded} (làm tròn ${decimals} chữ số thập phân, gốc ${expected.toFixed(3)})`);
    expect(actual, `${label} phải = ${expectedRounded} (thực tế: "${actualText}")`).toBe(expectedRounded);
  }

  /**
   * So sánh giá trị cột HK1/HK2 hiển thị trên lưới với công thức:
   * HK = Σ(điểm cột * hệ số trong SCORE_COLUMN_WEIGHTS) / Σ hệ số.
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertSemesterScoreFormula(
    scoresByStudent: Record<string, Record<string, number>>,
    semesterColName: string,
    studentCodes: string[],
  ): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${semesterColName}" cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const scores = scoresByStudent[studentCode];
      if (!scores) continue;
      this.logger.info(`HS ${studentCode}: điểm đã ghi nhận lúc nhập = ${JSON.stringify(scores)}`);

      let weightedSum = 0;
      let totalWeight = 0;
      for (const [col, weight] of Object.entries(SCORE_COLUMN_WEIGHTS)) {
        const score = scores[col];
        if (score === undefined) {
          this.logger.warn(`HS ${studentCode}: ko có điểm cho cột "${col}" (hệ số ${weight}) => bỏ qua`);
          continue;
        }

        // Đọc lại giá trị đang hiện trên lưới để đối chiếu với điểm đã ghi nhận lúc nhập
        const { text: gridText, value: gridValue } = await this.getGridCellNumber(row, col);
        if (gridValue !== score) {
          this.logger.warn(`HS ${studentCode}: cột "${col}" đã nhập=${score} nhưng lưới đang hiện "${gridText}" → LỆCH`);
        }
        //this.logger.info(`HS ${studentCode}: cột "${col}" (hệ số ${weight}) = ${score} (lưới hiện "${gridText}")`);
        weightedSum += score * weight;
        totalWeight += weight;
      }
      if (totalWeight === 0) continue;
      const expected = weightedSum / totalWeight; // ko làm tròn, giữ nguyên giá trị lẻ để so đúng với thực tế
      this.logger.info(`HS ${studentCode}: tổng điểm có trọng số=${weightedSum.toFixed(3)}, tổng hệ số=${totalWeight}, kỳ vọng=${expected.toFixed(3)}`);

      const { text: actualText, value: actual } = await this.getGridCellNumber(row, semesterColName);
      this.assertGridScoreEquals(`"${semesterColName}" của HS ${studentCode}`, actualText, actual, expected);
    }
  }

  /**
   * So sánh giá trị cột "Cuối năm" hiển thị trên lưới với công thức:
   * CN = Σ(điểm cột * hệ số trong FINAL_SCORE_COLUMN_WEIGHTS) / Σ hệ số.
   * Đọc trực tiếp HK1/HK2 từ lưới (không cần điểm vừa nhập) nên phải bỏ filter semester trước khi gọi.
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertFinalScoreFormula(studentCodes: string[], finalColName = 'Cuối năm'): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${finalColName}" cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      let weightedSum = 0;
      let totalWeight = 0;
      for (const [col, weight] of Object.entries(FINAL_SCORE_COLUMN_WEIGHTS)) {
        const { text, value } = await this.getGridCellNumber(row, col);
        if (text === '') continue; // cột rỗng => bỏ qua, ko tính vào tổng hệ số; điểm "0" vẫn được tính
        this.logger.info(`HS ${studentCode}: cột "${col}" (hệ số ${weight}) = ${value} (lưới hiện "${text}")`);
        weightedSum += value * weight;
        totalWeight += weight;
      }
      if (totalWeight === 0) continue;
      const expected = weightedSum / totalWeight; // ko làm tròn, giữ nguyên giá trị lẻ để so đúng với thực tế
      this.logger.info(`HS ${studentCode}: tổng điểm có trọng số=${weightedSum.toFixed(3)}, tổng hệ số=${totalWeight}, kỳ vọng=${expected.toFixed(3)}`);

      const { text: actualText, value: actual } = await this.getGridCellNumber(row, finalColName);
      this.assertGridScoreEquals(`"${finalColName}" của HS ${studentCode}`, actualText, actual, expected);
    }
  }

  /**
   * So sánh giá trị cột HK1/HK2 hiển thị trên lưới với công thức copy nguyên giá trị 1 cột nguồn
   * (bậc Tiểu học: HK1 = Cuối kỳ 1, HK2 = Cuối kỳ 2 — không phải trung bình trọng số như THCS/THPT).
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertSemesterScoreCopyFormula(
    scoresByStudent: Record<string, Record<string, number>>,
    semesterColName: string,
    sourceColName: string,
    studentCodes: string[],
  ): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${semesterColName}" = "${sourceColName}" cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const expected = scoresByStudent[studentCode]?.[sourceColName];
      if (expected === undefined) {
        this.logger.warn(`HS ${studentCode}: ko có điểm cho cột nguồn "${sourceColName}" => bỏ qua`);
        continue;
      }

      const { text: actualText, value: actual } = await this.getGridCellNumber(row, semesterColName);
      this.assertGridScoreEquals(`"${semesterColName}" của HS ${studentCode}`, actualText, actual, expected);
    }
  }

  /**
   * So sánh giá trị cột "Cuối năm" hiển thị trên lưới với công thức copy nguyên giá trị:
   * CN = HK2 (bậc Tiểu học). Đọc trực tiếp cột nguồn từ lưới nên phải bỏ filter semester trước khi gọi.
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertFinalScoreCopyFormula(studentCodes: string[], finalColName = 'Cuối năm', sourceColName = 'Học kỳ 2'): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${finalColName}" = "${sourceColName}" cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const { text: expectedText, value: expected } = await this.getGridCellNumber(row, sourceColName);
      if (expectedText === '') {
        this.logger.warn(`HS ${studentCode}: ko có điểm cho cột nguồn "${sourceColName}" => bỏ qua`);
        continue;
      }

      const { text: actualText, value: actual } = await this.getGridCellNumber(row, finalColName);
      this.assertGridScoreEquals(`"${finalColName}" của HS ${studentCode}`, actualText, actual, expected);
    }
  }

  /**
   * Chỉ nhập điểm chữ (dropdown Đạt/Chưa đạt) cho các HS chỉ định theo mã HS.
   * Dùng cho môn học tính điểm bằng nhận xét (vd Giáo dục thể chất), khác với môn tính điểm số.
   */
  async enterLetterScoresForStudents(studentCodes: string[], excludeCols: string[] = []): Promise<Record<string, Record<string, string>>> {
    const cols = await this.getScoreInputColumns(excludeCols);
    const rowCount = await this.listPage.getRowCount();

    const rows: number[] = [];
    for (let row = 0; row < rowCount; row++) {
      const code = await this.listPage.getStudentCodeAt(row);
      if (studentCodes.includes(code)) rows.push(row);
    }
    this.logger.step(`Nhập điểm chữ cho ${rows.length}/${rowCount} HS (${studentCodes.join(', ')}), ${cols.length} cột: ${cols.join(', ')}`);

    // Xóa data cột HK trước khi nhập điểm mới, để HK được tính lại từ điểm mới thay vì giữ giá trị cũ
    for (const col of excludeCols) {
      await this.deleteColumnScores(col);
    }

    const scoresByStudent: Record<string, Record<string, string>> = {};

    for (const col of cols) {
      const colType = await this.detectCellTypeAtColumn(col);
      this.logger.info(`Cột "${col}" → type: "${colType}"`);
      if (colType !== 'dropdown') {
        this.logger.warn(`Cột "${col}": type "${colType}" ko phải dropdown, bỏ qua (môn điểm chữ)`);
        continue;
      }

      await this.deleteColumnScores(col);
      for (const row of rows) {
        const studentCode = await this.listPage.getStudentCodeAt(row);
        const value = await this.enterDropdownCell(row, col);
        if (value === null) {
          this.logger.warn(`  Hàng ${row} (${studentCode}): cột "${col}" nhập thất bại`);
          continue;
        }
        (scoresByStudent[studentCode] ??= {})[col] = value;
        this.logger.info(`  Hàng ${row} (${studentCode}): cột "${col}" = "${value}"`);
      }
    }

    this.logger.step('Lưu dữ liệu');
    await this.listPage.saveBtn.click();
    await this.listPage.saveSuccessToast().waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });

    for (const [studentCode, scores] of Object.entries(scoresByStudent)) {
      this.logger.info(`Điểm chữ đã nhập cho HS ${studentCode}: ${JSON.stringify(scores)}`);
    }

    return scoresByStudent;
  }

  /**
   * So sánh giá trị cột HK1/HK2 hiển thị trên lưới với công thức (môn điểm chữ):
   * HK = "Đạt" nếu tất cả cột TX/GK/CK đã nhập = "Đạt"; "Chưa đạt" nếu có ít nhất 1 cột = "Chưa đạt".
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertSemesterLetterFormula(
    scoresByStudent: Record<string, Record<string, string>>,
    semesterColName: string,
    studentCodes: string[],
  ): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${semesterColName}" (điểm chữ) cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const scores = scoresByStudent[studentCode];
      if (!scores || Object.keys(scores).length === 0) continue;
      this.logger.info(`HS ${studentCode}: điểm chữ đã ghi nhận lúc nhập = ${JSON.stringify(scores)}`);

      const values = Object.values(scores);
      const expected = values.every(v => v === 'Đạt') ? 'Đạt' : 'Chưa đạt';

      const actualText = await this.getGridCellText(row, semesterColName);
      this.logger.info(`HS ${studentCode}: "${semesterColName}" thực tế="${actualText}", kỳ vọng="${expected}"`);
      expect(
        actualText,
        `"${semesterColName}" của HS ${studentCode} phải = "${expected}" (thực tế: "${actualText}")`
      ).toBe(expected);
    }
  }

  /**
   * So sánh giá trị cột HK1/HK2 hiển thị trên lưới với công thức copy nguyên giá trị 1 cột nguồn (điểm chữ)
   * (bậc Tiểu học, môn tính bằng nhận xét: HK1 = Mức đạt được - CK1, HK2 = Mức đạt được - CK2).
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertSemesterLetterCopyFormula(
    scoresByStudent: Record<string, Record<string, string>>,
    semesterColName: string,
    sourceColName: string,
    studentCodes: string[],
  ): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${semesterColName}" = "${sourceColName}" (điểm chữ) cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const expected = scoresByStudent[studentCode]?.[sourceColName];
      if (expected === undefined) {
        this.logger.warn(`HS ${studentCode}: ko có điểm cho cột nguồn "${sourceColName}" => bỏ qua`);
        continue;
      }

      const actualText = await this.getGridCellText(row, semesterColName);
      this.logger.info(`HS ${studentCode}: "${semesterColName}" thực tế="${actualText}", kỳ vọng="${expected}"`);
      expect(
        actualText,
        `"${semesterColName}" của HS ${studentCode} phải = "${expected}" (thực tế: "${actualText}")`
      ).toBe(expected);
    }
  }

  /**
   * So sánh giá trị cột "Cuối năm" hiển thị trên lưới với công thức (môn điểm chữ): CN = HK2 (copy nguyên giá trị).
   * Đọc trực tiếp "Học kỳ 2" từ lưới nên phải bỏ filter semester trước khi gọi.
   * Chỉ kiểm tra các HS trong studentCodes (danh sách vừa nhập điểm).
   */
  async assertFinalLetterFormula(studentCodes: string[], finalColName = 'Cuối năm', hk2ColName = 'Học kỳ 2'): Promise<void> {
    this.logger.step(`Kiểm tra công thức "${finalColName}" (điểm chữ) cho ${studentCodes.length} HS (${studentCodes.join(', ')})`);
    const rowCount = await this.listPage.getRowCount();

    for (let row = 0; row < rowCount; row++) {
      const studentCode = await this.listPage.getStudentCodeAt(row);
      if (!studentCodes.includes(studentCode)) continue;

      const expected = await this.getGridCellText(row, hk2ColName);
      const actualText = await this.getGridCellText(row, finalColName);

      this.logger.info(`HS ${studentCode}: "${finalColName}" thực tế="${actualText}", kỳ vọng (= "${hk2ColName}")="${expected}"`);
      expect(
        actualText,
        `"${finalColName}" của HS ${studentCode} phải = "${expected}" (thực tế: "${actualText}")`
      ).toBe(expected);
    }
  }

  // ── Score/comment entry ────────────────────────────────────────────────

  private async getScoreInputColumns(excludeCols: string[] = []): Promise<string[]> {
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
      if (text && !(EXCLUDED_SCORE_COLUMN_CAPTIONS as readonly string[]).includes(text) && !excludeCols.includes(text)) cols.push(text);
    }
    return cols;
  }

  private async enterScoreCell(row: number, col: string, score: number = randomScore()): Promise<number> {
    const cell = await this.listPage.getCell(row, col);
    if (!cell) throw new Error(`Column "${col}" not found`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      await cell.click();
      const input = cell.locator('input:not([type="hidden"])').first();
      await this.listPage.waitForElement(input, TIMEOUTS.SHORT);
      await input.fill(String(score));
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(300);

      // fill() đôi khi ko kịp commit vào model trước khi rời ô → đọc lại để xác nhận, ko khớp thì nhập lại
      const savedText = ((await cell.textContent()) ?? '').trim();
      if (savedText === String(score)) return score;
      this.logger.warn(`Cột "${col}" hàng ${row}: nhập "${score}" nhưng ô hiện "${savedText}", thử lại lần ${attempt}`);
    }

    throw new Error(`Cột "${col}" hàng ${row}: nhập điểm "${score}" thất bại sau 3 lần thử`);
  }

  private async enterDropdownCell(row: number, col: string): Promise<string | null> {
    const cell = await this.listPage.getCell(row, col);
    if (!cell) return null;
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
      return null;
    }

    const opt = items.filter({ hasText: new RegExp(`^${targetValue}$`) }).first();
    await opt.click({ force: true });
    await this.page.waitForTimeout(200);
    return targetValue;
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
