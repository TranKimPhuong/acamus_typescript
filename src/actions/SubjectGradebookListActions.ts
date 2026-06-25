import { Page, test } from '@playwright/test';
import { SubjectGradebookListPage } from '../pages/SubjectGradebookListPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import {
  TEST_CLASS,
  GRADEBOOK_TEMPLATE,
  SCORE_SUBJECTS,
  COMMENT_SUBJECTS,
  NO_GRADEBOOK_SUBJECTS,
} from '../constants/ClassConstants';
import { TIMEOUTS } from '../constants/LoginConstants';

export class SubjectGradebookListActions {
  private page: Page;
  private listPage: SubjectGradebookListPage;
  private nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new SubjectGradebookListPage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('SubjectGradebookListActions');
  }

  /** Bước 2: Điều hướng qua menu Sổ điểm → Thiết lập sổ điểm mẫu → Danh sách sổ điểm mẫu */
  async navigateToGradingBookViewsList(): Promise<void> {
    await this.nav.navigateToGradingBookViewsList();
    await this.listPage.waitForPageLoad();
    await this.page.waitForTimeout(2000);
  }

  /** Bước 3: Tìm tên chương trình, trả về true nếu có data, false nếu không thấy */
  async searchProgram(programName: string): Promise<boolean> {
    this.logger.step(`Tìm tên chương trình: "${programName}"`);

    const filterCell = this.listPage.programFilterCell();
    const filterVisible = await filterCell.isVisible().catch(() => false);
    if (filterVisible) {
      await filterCell.clear();
      await filterCell.fill(programName);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1500);
    }

    const row = this.listPage.gradeBlockRow(programName);
    const found = await row.isVisible({ timeout: TIMEOUTS.MEDIUM }).catch(() => false);
    if (found) {
      this.logger.info(`Tìm thấy chương trình "${programName}" ✓`);
    } else {
      this.logger.error(`Không tìm thấy chương trình "${programName}"`);
    }
    return found;
  }

  /**
   * Kiểm tra sổ điểm mẫu của một môn học.
   * - Nếu môn không có row → throw (precondition fail)
   * - Nếu có row nhưng cell rỗng → throw (chưa tạo sổ điểm)
   * - Nếu có giá trị → trả về tên template
   */
  private async getSubjectTemplate(subjectName: string): Promise<string> {
    const row = this.listPage.subjectRow(subjectName);
    const rowVisible = await row.isVisible({ timeout: TIMEOUTS.MEDIUM }).catch(() => false);
    if (!rowVisible) {
      throw new Error(`Không tìm thấy môn học: "${subjectName}"`);
    }

    const cell = this.listPage.gradebookTemplateCell(subjectName);
    let cellText = (await cell.innerText().catch(() => '')).trim();

    // Fallback 1: some implementations render the template in a title attribute on the cell
    if (!cellText) {
      const titleAttr = await row
        .locator('td[title], [role="gridcell"][title]')
        .first()
        .getAttribute('title')
        .catch(() => null);
      if (titleAttr) cellText = titleAttr.trim();
    }

    // Fallback 2: search any cell in the row that contains the phrase 'Sổ điểm' (template label)
    if (!cellText) {
      const alt = await row
        .locator('td:has-text("Sổ điểm"), [role="gridcell"]:has-text("Sổ điểm")')
        .first()
        .innerText()
        .catch(() => '');
      if (alt) cellText = alt.trim();
    }

    if (!cellText) {
      throw new Error(`Môn "${subjectName}" chưa được gán sổ điểm mẫu`);
    }
    return cellText;
  }

  /**
   * Bước 4-5: Đi qua từng môn học và kiểm tra sổ điểm mẫu đã đúng chưa.
   * - Môn chấm điểm → phải có template SCORE
   * - Môn nhận xét   → phải có template COMMENT
   * - Môn ko gán     → phải không có template (cell rỗng)
   */
  async verifyAllSubjectGradebookTemplates(): Promise<void> {
    this.logger.step('Kiểm tra sổ điểm mẫu các môn chấm bằng điểm số');
    for (const subject of SCORE_SUBJECTS) {
      const template = await this.getSubjectTemplate(subject);
      if (template !== GRADEBOOK_TEMPLATE.SCORE) {
        throw new Error(
          `Môn "${subject}": kỳ vọng "${GRADEBOOK_TEMPLATE.SCORE}" nhưng nhận được "${template}"`
        );
      }
      this.logger.info(`✓ ${subject} → ${template}`);
    }

    this.logger.step('Kiểm tra sổ điểm mẫu các môn chấm bằng nhận xét');
    for (const subject of COMMENT_SUBJECTS) {
      const template = await this.getSubjectTemplate(subject);
      if (template !== GRADEBOOK_TEMPLATE.COMMENT) {
        throw new Error(
          `Môn "${subject}": kỳ vọng "${GRADEBOOK_TEMPLATE.COMMENT}" nhưng nhận được "${template}"`
        );
      }
      this.logger.info(`✓ ${subject} → ${template}`);
    }

    this.logger.step('Kiểm tra môn không gán sổ điểm');
    for (const subject of NO_GRADEBOOK_SUBJECTS) {
      const row = this.listPage.subjectRow(subject);
      const rowVisible = await row.isVisible({ timeout: TIMEOUTS.MEDIUM }).catch(() => false);
      if (!rowVisible) {
        throw new Error(`[PRECONDITION FAIL] Không tìm thấy môn học: "${subject}"`);
      }
      const cell = this.listPage.gradebookTemplateCell(subject);
      const cellText = (await cell.innerText().catch(() => '')).trim();
      if (cellText) {
        throw new Error(`Môn "${subject}" kỳ vọng không có sổ điểm nhưng nhận được "${cellText}"`);
      }
      this.logger.info(`✓ ${subject} → (không gán sổ điểm)`);
    }
  }
}
