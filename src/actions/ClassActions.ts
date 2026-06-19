import { Page, expect } from '@playwright/test';
import { ClassPage } from '../pages/ClassPage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class ClassActions {
  private page: Page;
  private classPage: ClassPage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.classPage = new ClassPage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('ClassActions');
  }

  /** Kiểm tra record tồn tại trong danh sách — giả sử đã ở trang Class list */
  async assertClassRecordExists(code: string, name: string): Promise<void> {
    this.logger.step(`Kiểm tra record code="${code}" name="${name}" tồn tại`);
    const row = this.classPage.classRowByCodeAndName(code, name);
    await expect(row).toBeVisible({ timeout: TIMEOUTS.LONG });
    this.logger.info(`Lớp "${code} - ${name}" tồn tại ✓`);
  }

  /** Click vào tên lớp trong danh sách để mở trang detail */
  async openClassDetail(name: string): Promise<void> {
    this.logger.step(`Mở chi tiết lớp "${name}"`);
    await this.classPage.clickElement(this.classPage.classNameLink(name));
    await this.classPage.waitForPageLoad();
    await this.page.waitForTimeout(1500);
  }

  /** Navigate + assert (dùng cho precondition check ở các test khác) */
  async assertClassExistsOrSkip(code: string, name: string): Promise<void> {
    await this.nav.navigateToClassList();
    await this.assertClassRecordExists(code, name);
  }
}
