import { Page, expect } from '@playwright/test';
import { LogoutPage } from '../pages/LogoutPage';
import { Logger } from '../libs/Logger';
import { TIMEOUTS, LOGOUT_URL } from '../constants/LoginConstants';

export class LogoutActions {
  private page: Page;
  private logoutPage: LogoutPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logoutPage = new LogoutPage(page);
    this.logger = new Logger('LogoutActions');
  }

  async assertOnLogoutPage(): Promise<void> {
    this.logger.step(`Assert current URL is logout page: ${LOGOUT_URL}`);
    await expect(this.page).toHaveURL(LOGOUT_URL, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertLogoutPageVisible(): Promise<void> {
    this.logger.step('Assert logout page elements are visible');
    await this.logoutPage.assertVisible(this.logoutPage.pageHeading);
  }
}
