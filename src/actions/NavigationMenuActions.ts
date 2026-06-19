import { Page } from '@playwright/test';
import { NavigationMenuPage } from '../pages/NavigationMenuPage';
import { SubjectGradingBookTemplatePage } from '../pages/SubjectGradingBookTemplatePage';
import { SubjectScoreGradebookListPage } from '../pages/SubjectScoreGradebookListPage';
import { ClassPage } from '../pages/ClassPage';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class NavigationMenuActions {
  private page: Page;
  private menuPage: NavigationMenuPage;
  private templateListPage: SubjectGradingBookTemplatePage;
  private scoreGradebookListPage: SubjectScoreGradebookListPage;
  private classPage: ClassPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.menuPage = new NavigationMenuPage(page);
    this.templateListPage = new SubjectGradingBookTemplatePage(page);
    this.scoreGradebookListPage = new SubjectScoreGradebookListPage(page);
    this.classPage = new ClassPage(page);
    this.logger = new Logger('NavigationMenuActions');
  }

  // ── Sổ điểm mẫu ─────────────────────────────────────────────────────────

  /** Menu: Sổ điểm → Cơ chế chấm điểm → DS Sổ điểm mẫu môn học */
  async navigateToGradingBookTemplateViaMenu(): Promise<void> {
    this.logger.step('Menu: Sổ điểm');
    await this.menuPage.waitForElement(this.menuPage.gradingBookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingBookMenu);

    this.logger.step('Menu con: Cơ chế chấm điểm');
    await this.menuPage.waitForElement(this.menuPage.gradingMechanismSubMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingMechanismSubMenu);

    this.logger.step('Mục: DS Sổ điểm mẫu môn học');
    await this.menuPage.waitForElement(this.menuPage.gradingBookTemplateItem, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingBookTemplateItem);

    await this.templateListPage.waitForPageLoad();
    await this.templateListPage.waitForElement(this.templateListPage.templateTable, TIMEOUTS.LONG);
  }

  // ── Lớp học ──────────────────────────────────────────────────────────────

  /** Menu: School management → Classes → Class list */
  async navigateToClassList(): Promise<void> {
    this.logger.step('Menu: School management');
    await this.menuPage.waitForElement(this.menuPage.schoolManagementMenu, TIMEOUTS.MEDIUM);
    const classVisible = await this.menuPage.classMenu.isVisible();
    if (!classVisible) {
      await this.menuPage.clickElement(this.menuPage.schoolManagementMenu);
    }

    this.logger.step('Menu con: Classes');
    await this.menuPage.waitForElement(this.menuPage.classMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.classMenu);

    this.logger.step('Mục: Class list');
    await this.classPage.waitForElement(this.menuPage.classListItem, TIMEOUTS.MEDIUM);
    await this.classPage.clickElement(this.menuPage.classListItem);
    await this.classPage.waitForPageLoad();
    await this.page.waitForTimeout(2000);
  }

  // ── Sổ điểm môn học ──────────────────────────────────────────────────────

  /** Menu: Sổ điểm → Điểm nhận xét môn học */
  async navigateToScoreGradebookList(): Promise<void> {
    this.logger.step('Menu: Sổ điểm');
    await this.menuPage.waitForElement(this.menuPage.gradingBookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingBookMenu);

    this.logger.step('Mục: Điểm nhận xét môn học');
    await this.menuPage.waitForElement(this.menuPage.subjectScoreGradebookItem, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.subjectScoreGradebookItem);

    await this.scoreGradebookListPage.waitForPageLoad();
    await this.scoreGradebookListPage.waitForElement(
      this.scoreGradebookListPage.listGrid,
      TIMEOUTS.LONG,
    );
    await this.page.waitForTimeout(1500);
  }
}
