import { Page, expect, test } from '@playwright/test';
import { SubjectGradebookListPage } from '../pages/SubjectGradebookListPage';
import { SubjectGradebookCreateDialogPage } from '../pages/SubjectGradebookCreateDialogPage';
import { SubjectGradebookTemplateDetailPage } from '../pages/SubjectGradebookTemplateDetailPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import {
  GRADEBOOK_TEMPLATE,
  SCORE_SUBJECTS,
  COMMENT_SUBJECTS,
  NO_GRADEBOOK_SUBJECTS,
} from '../constants/SubjectGradebookListConstants';
import { TIMEOUTS } from '../constants/LoginConstants';

export class SubjectGradebookListActions {
  private page: Page;
  private listPage: SubjectGradebookListPage;
  private createDialogPage: SubjectGradebookCreateDialogPage;
  private templateDetailPage: SubjectGradebookTemplateDetailPage;
  private nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new SubjectGradebookListPage(page);
    this.createDialogPage = new SubjectGradebookCreateDialogPage(page);
    this.templateDetailPage = new SubjectGradebookTemplateDetailPage(page);
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

  /** Kiểm tra môn học đã có sổ điểm mẫu chưa (dựa vào cell "Subject gradebook templates") */
  async hasGradebookTemplate(subjectName: string): Promise<boolean> {
    const cell = this.listPage.gradebookTemplateCell(subjectName);
    const text = (await cell.innerText().catch(() => '')).trim();
    return text.length > 0;
  }

  /** Xóa sổ điểm mẫu hiện có của môn học — popup "Create from template gradebook" tự mở lại để chọn sổ điểm mới */
  async deleteGradebookTemplate(subjectName: string): Promise<void> {
    this.logger.step(`Xóa sổ điểm mẫu hiện có của môn "${subjectName}"`);
    const deleteIcon = this.listPage.deleteIcon(subjectName);
    // Icon bị ẩn bởi CSS (chỉ hiện khi hover row) — chờ attached rồi click force
    await deleteIcon.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await deleteIcon.click({ force: true });

    const yesBtn = this.page.locator('abp-confirmation button#confirm, abp-confirmation .confirmation-button--approve');
    await expect(yesBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await yesBtn.click();

    // Sau khi xóa, popup "Create from template gradebook" tự mở lại
    await expect(this.createDialogPage.templateSelectInput()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  /** Bước 3: Click icon "+" (tạo mới) ở cột Action của môn học */
  async clickAddIcon(subjectName: string): Promise<void> {
    this.logger.step(`Click icon tạo mới của môn "${subjectName}"`);
    const icon = this.listPage.addIcon(subjectName);
    // Icon bị ẩn bởi CSS (chỉ hiện khi hover đúng vào icon) → hover trực tiếp vào icon rồi mới click
    await icon.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await icon.hover({ force: true });
    await icon.click();
  }

  /** Bước 4: Chọn sổ điểm mẫu trong popup "Create from template gradebook" */
  async selectGradebookTemplateInDialog(templateName: string): Promise<void> {
    this.logger.step(`Chọn sổ điểm mẫu = "${templateName}"`);
    const input = this.createDialogPage.templateSelectInput();
    await expect(input).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await input.click();
    await this.page.locator('.dx-list-item', { hasText: templateName }).first().click();
  }

  /** Bước 5: Nhấn Lưu trong popup, chờ popup đóng */
  async saveGradebookDialog(): Promise<void> {
    this.logger.step('Nhấn Lưu');
    await this.createDialogPage.saveButton.click();
    await expect(this.createDialogPage.saveButton).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
  }

  /** Bước 6: Click icon edit của môn học → mở trang chi tiết sổ điểm mẫu */
  async openGradebookDetail(subjectName: string): Promise<void> {
    this.logger.step(`Click icon edit của môn "${subjectName}"`);
    const icon = this.listPage.editIcon(subjectName);
    await expect(icon).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await icon.click();
    await this.templateDetailPage.waitForElement(this.templateDetailPage.columnConfigTable, TIMEOUTS.LONG);
    await this.page.waitForTimeout(500);
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

  /** Kiểm tra sổ điểm mẫu đã thêm thành công cho 1 môn học bất kì */
  async verifySubjectGradebookTemplate(subjectName: string, expectedTemplate: string): Promise<void> {
    const template = await this.getSubjectTemplate(subjectName);
    if (template !== expectedTemplate) {
      throw new Error(
        `Môn "${subjectName}": kỳ vọng "${expectedTemplate}" nhưng nhận được "${template}"`
      );
    }
    this.logger.info(`✓ ${subjectName} → ${template}`);
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
      await this.verifySubjectGradebookTemplate(subject, GRADEBOOK_TEMPLATE.SCORE_THCS);
    }

    this.logger.step('Kiểm tra sổ điểm mẫu các môn chấm bằng nhận xét');
    for (const subject of COMMENT_SUBJECTS) {
      await this.verifySubjectGradebookTemplate(subject, GRADEBOOK_TEMPLATE.COMMENT_THCS);
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
