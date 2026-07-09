import { Page, expect } from '@playwright/test';
import { TotalScorePage } from '../pages/TotalScorePage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class TotalScoreActions {
  private page: Page;
  private listPage: TotalScorePage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new TotalScorePage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('TotalScoreActions');
  }

  /** Chọn lớp trong dropdown "Lớp chủ nhiệm" */
  async selectClass(className: string): Promise<void> {
    this.logger.step(`Chọn lớp: "${className}"`);
    const classInput = this.listPage.classInput;
    await this.listPage.waitForElement(classInput, TIMEOUTS.MEDIUM);
    await classInput.click();
    await classInput.selectText();
    await classInput.pressSequentially(className, { delay: 50 });
    await this.page.waitForTimeout(600);

    const targetItem = this.listPage.classDropdownItem(className);
    await this.listPage.waitForElement(targetItem, TIMEOUTS.MEDIUM);
    await targetItem.click();
    await this.page.waitForTimeout(600);
    this.logger.info(`Đã chọn lớp: "${className}"`);
  }

  /**
   * Chưa gán sổ điểm tổng kết mẫu cho lớp/chương trình → trang hiện cảnh báo "Sổ điểm chưa được thiết lập".
   * Chờ attached trong TIMEOUTS.MEDIUM (không phải check ngay) vì cảnh báo/lưới đều cần gọi API sau khi chọn lớp.
   */
  async isGradebookNotConfigured(): Promise<boolean> {
    return await this.listPage.notConfiguredWarning
      .waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Kiểm tra bảng điểm tổng kết có ít nhất 1 học sinh.
   * Dùng expect.poll vì lưới cần gọi API để load điểm/HS sau khi chọn lớp,
   * count() một lần ngay có thể đọc được 0 do chưa load xong (race condition).
   */
  async assertStudentListVisible(): Promise<void> {
    this.logger.step('Kiểm tra danh sách học sinh hiện ra');
    await expect.poll(
      () => this.listPage.studentRows.count(),
      { timeout: TIMEOUTS.LONG }
    ).toBeGreaterThan(0);
    const rowCount = await this.listPage.studentRows.count();
    this.logger.info(`Bảng điểm tổng kết có ${rowCount} học sinh`);
  }
}
