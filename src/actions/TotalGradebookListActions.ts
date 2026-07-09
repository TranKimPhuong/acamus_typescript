import { Page, expect } from '@playwright/test';
import { TotalGradebookListPage } from '../pages/TotalGradebookListPage';
import { TotalGradebookCreateDialogPage } from '../pages/TotalGradebookCreateDialogPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class TotalGradebookListActions {
  private page: Page;
  private listPage: TotalGradebookListPage;
  private createDialogPage: TotalGradebookCreateDialogPage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new TotalGradebookListPage(page);
    this.createDialogPage = new TotalGradebookCreateDialogPage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('TotalGradebookListActions');
  }

  /** Lọc danh sách theo Khối */
  async filterByGrade(gradeName: string): Promise<void> {
    this.logger.step(`Lọc theo Khối: "${gradeName}"`);
    await this.listPage.waitForElement(this.listPage.gradeFilterInput, TIMEOUTS.MEDIUM);
    await this.listPage.gradeFilterInput.click();

    const item = this.listPage.gradeDropdownItem(gradeName);
    await this.listPage.waitForElement(item, TIMEOUTS.MEDIUM);
    await item.click();

    await this.listPage.dropdownConfirmButton.click();
    await this.listPage.filterButton.click();
    await this.page.waitForTimeout(1000);
    this.logger.info(`Đã lọc theo Khối: "${gradeName}"`);
  }

  /** Kiểm tra Khối đã có sổ điểm mẫu tổng kết chưa (dựa vào cell "Total gradebook templates") */
  async hasGradebookTemplate(gradeName: string): Promise<boolean> {
    const cell = this.listPage.gradebookTemplateCell(gradeName);
    const text = (await cell.innerText().catch(() => '')).trim();
    return text.length > 0;
  }

  /** Click icon "+" (tạo mới) ở cột Action của Khối */
  async clickAddIcon(gradeName: string): Promise<void> {
    this.logger.step(`Click icon tạo mới của Khối "${gradeName}"`);
    const icon = this.listPage.addIcon(gradeName);
    await icon.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await icon.click();
  }

  /** Xóa sổ điểm mẫu tổng kết hiện có của Khối — popup "Create from template gradebook" tự mở lại để chọn sổ điểm mới */
  async deleteGradebookTemplate(gradeName: string): Promise<void> {
    this.logger.step(`Xóa sổ điểm mẫu tổng kết hiện có của Khối "${gradeName}"`);
    const deleteIcon = this.listPage.deleteIcon(gradeName);
    await deleteIcon.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });
    await deleteIcon.click();

    const yesBtn = this.page.locator('abp-confirmation button#confirm, abp-confirmation .confirmation-button--approve');
    await expect(yesBtn).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await yesBtn.click();

    // Sau khi xóa, popup "Create from template gradebook" tự mở lại
    await expect(this.createDialogPage.templateSelectInput()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  /** Chọn sổ điểm mẫu trong popup "Create Total gradebook from template" */
  async selectGradebookTemplateInDialog(templateName: string): Promise<void> {
    this.logger.step(`Chọn sổ điểm mẫu tổng kết = "${templateName}"`);
    const input = this.createDialogPage.templateSelectInput();
    await expect(input).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await input.click();
    await this.page.locator('.dx-list-item', { hasText: templateName }).first().click();
  }

  /** Nhấn Lưu trong popup, chờ popup đóng */
  async saveGradebookDialog(): Promise<void> {
    this.logger.step('Nhấn Lưu');
    await this.createDialogPage.saveButton.click();
    await expect(this.createDialogPage.saveButton).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
  }

  /** Kiểm tra sổ điểm mẫu tổng kết đã thêm thành công cho Khối */
  async verifyGradebookTemplate(gradeName: string, expectedTemplate: string): Promise<void> {
    const cell = this.listPage.gradebookTemplateCell(gradeName);
    const text = (await cell.innerText().catch(() => '')).trim();
    expect(
      text,
      `Khối "${gradeName}": kỳ vọng "${expectedTemplate}" nhưng nhận được "${text}"`
    ).toBe(expectedTemplate);
    this.logger.info(`✓ Khối ${gradeName} → ${text}`);
  }
}
