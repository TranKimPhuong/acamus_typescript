import { Page, expect } from '@playwright/test';
import { SubjectScoreGradebookListPage } from '../pages/SubjectScoreGradebookListPage';
import { SubjectScoreGradebookDetailPage } from '../pages/SubjectScoreGradebookDetailPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';
import { TEST_CLASS } from '../constants/ClassConstants';
import {
  SCORE_COLS,
  ScoreCol,
  SemesterScores,
  CourseScores,
  COL_CAPTION_ALIASES,
  SEMESTER_LABEL,
  Semester,
  DEFAULT_HK_WEIGHTS,
  generateRandomSemesterScores,
  calcHKScore,
  calcYearScore,
  round1,
} from '../constants/SubjectScoreGradebookConstants';

export class SubjectScoreGradebookActions {
  private page: Page;
  private listPage: SubjectScoreGradebookListPage;
  private detailPage: SubjectScoreGradebookDetailPage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new SubjectScoreGradebookListPage(page);
    this.detailPage = new SubjectScoreGradebookDetailPage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('SubjectScoreGradebookActions');
  }

  /**
   * Returns the count of course rows visible for class 12A1_auto.
   * Assumes the list is already filtered or shows all courses.
   */
  async getCourseCountFor12A1Auto(): Promise<number> {
    this.logger.step(`Đếm số lớp bộ môn có tên chứa "${TEST_CLASS.NAME}"`);
    const rows = this.listPage.rowsContaining(TEST_CLASS.NAME);
    const count = await rows.count();
    this.logger.info(`Tìm thấy ${count} lớp bộ môn`);
    return count;
  }

  /**
   * Open the score entry view for the nth course (0-indexed).
   * Tries clicking the link/button inside the row; falls back to row click itself.
   */
  async openCourseScoreEntry(courseIndex: number): Promise<string> {
    const row = this.listPage.nthRowContaining(TEST_CLASS.NAME, courseIndex);
    await this.listPage.waitForElement(row, TIMEOUTS.MEDIUM);

    // Get the course name text for logging
    const courseName = (await row.textContent() ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
    this.logger.step(`Mở lớp bộ môn #${courseIndex + 1}: "${courseName}"`);

    // Prefer a dedicated open/edit button; fall back to clicking the row
    const openBtn = this.listPage.openScoreEntryButton(row);
    const btnVisible = await openBtn.isVisible().catch(() => false);
    if (btnVisible) {
      await openBtn.click();
    } else {
      await row.click();
    }

    // Wait for the score entry grid to appear
    await this.detailPage.waitForElement(this.detailPage.scoreGrid, TIMEOUTS.LONG);
    await this.page.waitForTimeout(1000);
    return courseName;
  }

  // ── Column resolution ────────────────────────────────────────────────────

  /**
   * Find the dataField for a score column (TX1/TX2/.../GK/CK) within a semester.
   * Uses a single DevExtreme API evaluate() call.
   *
   * Strategy:
   *  1. Locate the band column for the semester (e.g., "Học kỳ 1") — band columns have no dataField.
   *  2. Among child columns (ownerBand === band.index), find the one matching the column label.
   *  3. Fallback: match by caption alone if no band structure exists.
   */
  async findDataField(semester: Semester, scoreCol: ScoreCol): Promise<string | null> {
    const semesterCaption = SEMESTER_LABEL[semester];
    const aliases = COL_CAPTION_ALIASES[scoreCol] ?? [scoreCol];

    return this.page.evaluate(([semCap, aliasList]) => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return null;

      const cols = grid.getVisibleColumns() as any[];

      // Band column for this semester (no dataField, caption === semester label)
      const band = cols.find((c: any) => !c.dataField && c.caption?.trim() === semCap);

      if (band) {
        // Child columns share the band's `index` as their `ownerBand`
        const match = cols.find(
          (c: any) =>
            c.dataField &&
            c.ownerBand === band.index &&
            (aliasList as string[]).some(
              (alias: string) => c.caption?.trim().toLowerCase() === alias.toLowerCase()
            )
        );
        if (match) return match.dataField as string;
      }

      // Fallback: no band structure — match by caption alone
      const fallback = cols.find(
        (c: any) =>
          c.dataField &&
          (aliasList as string[]).some(
            (alias: string) => c.caption?.trim().toLowerCase() === alias.toLowerCase()
          )
      );
      return fallback?.dataField ?? null;
    }, [semesterCaption, aliases] as [string, string[]]);
  }

  // ── Score entry ──────────────────────────────────────────────────────────

  /**
   * Enter scores for all 7 columns of one semester (TX1-TX5, GK, CK) for row 0.
   * Returns the dataFields used so we can read them back for verification.
   */
  async enterSemesterScores(
    semester: Semester,
    scores: SemesterScores,
  ): Promise<Record<ScoreCol, string>> {
    this.logger.step(`Nhập điểm ${semester}: ${JSON.stringify(scores)}`);
    const dataFields: Partial<Record<ScoreCol, string>> = {};

    for (const col of SCORE_COLS) {
      const dataField = await this.findDataField(semester, col);
      if (!dataField) {
        this.logger.warn(`Không tìm thấy dataField cho cột "${col}" - ${semester}, bỏ qua`);
        continue;
      }
      dataFields[col] = dataField;

      await this.detailPage.clickCell(0, dataField);
      await this.detailPage.waitForElement(this.detailPage.activeCellInput, TIMEOUTS.SHORT);
      await this.detailPage.activeCellInput.fill(String(scores[col]));
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(200);
    }

    return dataFields as Record<ScoreCol, string>;
  }

  /**
   * Click the Lưu button and wait for the success indicator.
   */
  async saveScores(): Promise<void> {
    this.logger.step('Nhấn Lưu');
    await this.detailPage.waitForElement(this.detailPage.saveButton, TIMEOUTS.MEDIUM);
    await this.detailPage.saveButton.click();

    // Wait for save to complete — either success message or grid exit from edit mode
    await this.page.waitForTimeout(2000);
    await this.listPage.waitForPageLoad();
  }

  // ── Verification ─────────────────────────────────────────────────────────

  /**
   * After saving, read back cell values for each semester and verify they match
   * the entered scores. Also read HK and CN (year score) and verify the formula.
   */
  async verifyScoresAndFormula(
    hk1DataFields: Record<ScoreCol, string>,
    hk2DataFields: Record<ScoreCol, string>,
    hk1Scores: SemesterScores,
    hk2Scores: SemesterScores,
    hk1DataField: string,
    hk2DataField: string,
    cnDataField: string,
  ): Promise<void> {
    this.logger.step('Kiểm tra điểm đã lưu và công thức tính toán');

    // ── 1. Verify entered scores are persisted ─────────────────────────────
    for (const col of SCORE_COLS) {
      const dfHK1 = hk1DataFields[col];
      const dfHK2 = hk2DataFields[col];
      if (dfHK1) {
        const savedHK1 = await this.detailPage.readCellValue(0, dfHK1);
        expect(
          Number(savedHK1),
          `Điểm HK1.${col} sau lưu (${savedHK1}) phải bằng điểm đã nhập (${hk1Scores[col]})`
        ).toBe(hk1Scores[col]);
      }
      if (dfHK2) {
        const savedHK2 = await this.detailPage.readCellValue(0, dfHK2);
        expect(
          Number(savedHK2),
          `Điểm HK2.${col} sau lưu (${savedHK2}) phải bằng điểm đã nhập (${hk2Scores[col]})`
        ).toBe(hk2Scores[col]);
      }
    }

    // ── 2. Verify HK1 calculation formula ─────────────────────────────────
    const expectedHK1 = calcHKScore(hk1Scores, DEFAULT_HK_WEIGHTS);
    const displayedHK1Raw = await this.detailPage.readCellValue(0, hk1DataField);
    const displayedHK1 = round1(Number(displayedHK1Raw));
    this.logger.info(
      `HK1 kỳ vọng=${expectedHK1}  hiển thị=${displayedHK1}  ` +
      `(TX1*1+TX2*1+TX3*1+TX4*1+TX5*1+GK*2+CK*3)/10`
    );
    expect(
      displayedHK1,
      `HK1 hiển thị (${displayedHK1}) phải bằng giá trị tính theo công thức (${expectedHK1})`
    ).toBeCloseTo(expectedHK1, 1);

    // ── 3. Verify HK2 calculation formula ─────────────────────────────────
    const expectedHK2 = calcHKScore(hk2Scores, DEFAULT_HK_WEIGHTS);
    const displayedHK2Raw = await this.detailPage.readCellValue(0, hk2DataField);
    const displayedHK2 = round1(Number(displayedHK2Raw));
    this.logger.info(
      `HK2 kỳ vọng=${expectedHK2}  hiển thị=${displayedHK2}`
    );
    expect(
      displayedHK2,
      `HK2 hiển thị (${displayedHK2}) phải bằng giá trị tính theo công thức (${expectedHK2})`
    ).toBeCloseTo(expectedHK2, 1);

    // ── 4. Verify year (CN) score = (HK1*1 + HK2*2) / 3 ──────────────────
    const expectedCN = calcYearScore(expectedHK1, expectedHK2);
    const displayedCNRaw = await this.detailPage.readCellValue(0, cnDataField);
    const displayedCN = round1(Number(displayedCNRaw));
    this.logger.info(
      `CN kỳ vọng=${expectedCN}  hiển thị=${displayedCN}  ` +
      `(HK1*1 + HK2*2) / 3`
    );
    expect(
      displayedCN,
      `Điểm cả năm (${displayedCN}) phải bằng (HK1*1 + HK2*2) / 3 = ${expectedCN}`
    ).toBeCloseTo(expectedCN, 1);

    this.logger.info('Kiểm tra điểm và công thức PASS ✓');
  }

  /**
   * Find the dataField for the HK calculated column (e.g., "Học kỳ 1" average).
   * This is a top-level column with a dataField (not a band header).
   */
  async findHKDataField(semester: Semester): Promise<string> {
    const aliases =
      semester === 'HK1' ? ['Học kỳ 1', 'HK1', 'HK 1'] : ['Học kỳ 2', 'HK2', 'HK 2'];

    const dataField = await this.page.evaluate((aliasList) => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return null;
      const match = (grid.getVisibleColumns() as any[]).find(
        (c: any) =>
          c.dataField &&
          (aliasList as string[]).some((a: string) => c.caption?.trim() === a)
      );
      return match?.dataField ?? null;
    }, aliases as string[]);

    if (!dataField) throw new Error(`Không tìm thấy cột tính toán ${semester}`);
    return dataField;
  }

  /** Find the dataField for the year/CN (Cả năm / Cuối năm) column */
  async findCNDataField(): Promise<string> {
    const aliases = ['CN', 'Cả năm', 'Cuối năm', 'Ca nam'];

    const dataField = await this.page.evaluate((aliasList) => {
      const el = document.querySelector('.dx-datagrid') as HTMLElement;
      const DevExpress = (window as any).DevExpress;
      const grid = DevExpress?.ui?.dxDataGrid?.getInstance(el);
      if (!grid) return null;
      const match = (grid.getVisibleColumns() as any[]).find(
        (c: any) =>
          c.dataField &&
          (aliasList as string[]).some((a: string) => c.caption?.trim() === a)
      );
      return match?.dataField ?? null;
    }, aliases as string[]);

    if (!dataField) throw new Error('Không tìm thấy cột Cả năm / CN');
    return dataField;
  }

  // ── Full flow for one course ─────────────────────────────────────────────

  /**
   * Full flow: navigate to a course (by index), enter scores for both semesters,
   * save, and verify scores + formula.
   */
  async processOneCourse(courseIndex: number): Promise<void> {
    const courseName = await this.openCourseScoreEntry(courseIndex);

    // Generate random scores for both semesters
    const hk1Scores = generateRandomSemesterScores();
    const hk2Scores = generateRandomSemesterScores();
    this.logger.info(`HK1 scores: ${JSON.stringify(hk1Scores)}`);
    this.logger.info(`HK2 scores: ${JSON.stringify(hk2Scores)}`);

    // Enter HK1 scores
    const hk1DataFields = await this.enterSemesterScores('HK1', hk1Scores);

    // Enter HK2 scores
    const hk2DataFields = await this.enterSemesterScores('HK2', hk2Scores);

    // Save
    await this.saveScores();

    // Find the calculated HK and CN column dataFields
    const hk1DF = await this.findHKDataField('HK1');
    const hk2DF = await this.findHKDataField('HK2');
    const cnDF  = await this.findCNDataField();

    // Verify
    await this.verifyScoresAndFormula(
      hk1DataFields, hk2DataFields,
      hk1Scores, hk2Scores,
      hk1DF, hk2DF, cnDF,
    );

    this.logger.info(`Hoàn thành lớp bộ môn #${courseIndex + 1}: "${courseName}" ✓`);
  }

}
