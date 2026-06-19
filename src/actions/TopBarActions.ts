import { Page } from '@playwright/test';
import { TopBarPage } from '../pages/TopBarPage';
import { LogoutPage } from '../pages/LogoutPage';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class TopBarActions {
  private page: Page;
  private topBarPage: TopBarPage;
  private logoutPage: LogoutPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.topBarPage = new TopBarPage(page);
    this.logoutPage = new LogoutPage(page);
    this.logger = new Logger('TopBarActions');
  }

  // ── Campus & school-year ──────────────────────────────────────────────────

  async selectCampus(campusName: string): Promise<void> {
    this.logger.step(`Select campus: ${campusName}`);
    await this.topBarPage.clickElement(this.topBarPage.campusDropdown);
    await this.topBarPage.waitForElement(
      this.topBarPage.campusOption(campusName),
      TIMEOUTS.MEDIUM
    );
    await this.topBarPage.clickElement(this.topBarPage.campusOption(campusName));
    await this.topBarPage.waitForPageLoad();
    await this.page.waitForTimeout(1000);
  }

  async selectSchoolYear(yearName: string): Promise<void> {
    this.logger.step(`Select school year: ${yearName}`);
    await this.topBarPage.clickElement(this.topBarPage.schoolYearDropdown);
    await this.topBarPage.waitForElement(
      this.topBarPage.schoolYearOption(yearName),
      TIMEOUTS.MEDIUM
    );
    await this.topBarPage.clickElement(this.topBarPage.schoolYearOption(yearName));
    await this.topBarPage.waitForPageLoad();
    await this.page.waitForTimeout(1000);
  }

  async confirmSelection(): Promise<void> {
    this.logger.step('Confirm campus and school year selection');
    //await this.topBarPage.clickElement(this.topBarPage.confirmButton);
    await this.topBarPage.waitForPageLoad();
  }

  async selectCampusAndSchoolYear(campusName: string, yearName: string): Promise<void> {
    this.logger.step(`Select campus "${campusName}" and school year "${yearName}"`);
    await this.selectCampus(campusName);
    await this.selectSchoolYear(yearName);
    await this.confirmSelection();
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    this.logger.step('Open user menu dropdown');
    await this.topBarPage.waitForElement(this.topBarPage.userMenuButton, TIMEOUTS.MEDIUM);
    await this.topBarPage.clickElement(this.topBarPage.userMenuButton);

    this.logger.step('Wait for logout option to appear');
    await this.topBarPage.waitForElement(this.topBarPage.logoutButton, TIMEOUTS.SHORT);

    this.logger.step('Click logout');
    await this.topBarPage.clickElement(this.topBarPage.logoutButton);

    const confirmVisible = await this.topBarPage.logoutConfirmButton.isVisible().catch(() => false);
    if (confirmVisible) {
      this.logger.step('Confirm logout dialog');
      await this.topBarPage.clickElement(this.topBarPage.logoutConfirmButton);
    }

    this.logger.step('Wait for logout page');
    await this.logoutPage.waitForPageLoad();
  }

  async closeBrowser(): Promise<void> {
    this.logger.step('Closing browser');
    await this.page.close();
  }
}
