import { Page, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LogoutPage } from '../pages/LogoutPage';
import { Logger } from '../libs/Logger';
import { TIMEOUTS, LOGOUT_URL } from '../constants/LoginConstants';

export class DashboardActions {
  private page: Page;
  private dashboardPage: DashboardPage;
  private logoutPage: LogoutPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.dashboardPage = new DashboardPage(page);
    this.logoutPage = new LogoutPage(page);
    this.logger = new Logger('DashboardActions');
  }

  // ── Campus & school-year ──────────────────────────────────────────────────

  async selectCampus(campusName: string): Promise<void> {
    this.logger.step(`Select campus: ${campusName}`);
    await this.dashboardPage.clickElement(this.dashboardPage.campusDropdown);
    await this.dashboardPage.waitForElement(
      this.dashboardPage.campusOption(campusName),
      TIMEOUTS.MEDIUM
    );
    await this.dashboardPage.clickElement(this.dashboardPage.campusOption(campusName));
    await this.dashboardPage.waitForPageLoad();
    await this.page.waitForTimeout(1000);
  }

  async selectSchoolYear(yearName: string): Promise<void> {
    this.logger.step(`Select school year: ${yearName}`);
    await this.dashboardPage.clickElement(this.dashboardPage.schoolYearDropdown);
    await this.dashboardPage.waitForElement(
      this.dashboardPage.schoolYearOption(yearName),
      TIMEOUTS.MEDIUM
    );
    await this.dashboardPage.clickElement(this.dashboardPage.schoolYearOption(yearName));
    await this.dashboardPage.waitForPageLoad();
    await this.page.waitForTimeout(1000);
  }

  async confirmSelection(): Promise<void> {
    this.logger.step('Confirm campus and school year selection');
    //await this.dashboardPage.clickElement(this.dashboardPage.confirmButton);
    await this.dashboardPage.waitForPageLoad();
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
    await this.dashboardPage.waitForElement(this.dashboardPage.userMenuButton, TIMEOUTS.MEDIUM);
    await this.dashboardPage.clickElement(this.dashboardPage.userMenuButton);

    this.logger.step('Wait for logout option to appear');
    await this.dashboardPage.waitForElement(this.dashboardPage.logoutButton, TIMEOUTS.SHORT);

    this.logger.step('Click logout');
    await this.dashboardPage.clickElement(this.dashboardPage.logoutButton);

    const confirmVisible = await this.dashboardPage.logoutConfirmButton.isVisible().catch(() => false);
    if (confirmVisible) {
      this.logger.step('Confirm logout dialog');
      await this.dashboardPage.clickElement(this.dashboardPage.logoutConfirmButton);
    }

    this.logger.step('Wait for logout page');
    await this.logoutPage.waitForPageLoad();
  }

  async assertOnLogoutPage(): Promise<void> {
    this.logger.step(`Assert current URL is logout page: ${LOGOUT_URL}`);
    await expect(this.page).toHaveURL(LOGOUT_URL, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertLogoutPageVisible(): Promise<void> {
    this.logger.step('Assert logout page elements are visible');
    await this.logoutPage.assertVisible(this.logoutPage.pageHeading);
  }

  async closeBrowser(): Promise<void> {
    this.logger.step('Closing browser');
    await this.page.close();
  }
}
