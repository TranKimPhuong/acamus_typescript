import { Page } from '@playwright/test';
import { NavigationMenuPage } from '../pages/NavigationMenuPage';
import { SubjectGradebookTemplatePage } from '../pages/SubjectGradebookTemplatePage';
import { SubjectGradebookListPage } from '../pages/SubjectGradebookListPage';
import { SubjectGradebookScoreAndCommentPage } from '../pages/SubjectGradebookScoreAndCommentPage';
import { ClassPage } from '../pages/ClassPage';
import { Logger } from '../libs/Logger';
import { TIMEOUTS } from '../constants/LoginConstants';

export class NavigationMenuActions {
  private page: Page;
  private menuPage: NavigationMenuPage;
  private subjectGradebookTemplatePage: SubjectGradebookTemplatePage;
  private subjectGradebookListPage: SubjectGradebookListPage;
  private subjectGradebookScoreAndCommentPage!: SubjectGradebookScoreAndCommentPage;
  private classPage: ClassPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.menuPage = new NavigationMenuPage(page);
    this.subjectGradebookTemplatePage = new SubjectGradebookTemplatePage(page);
    this.subjectGradebookListPage = new SubjectGradebookListPage(page);
    this.subjectGradebookScoreAndCommentPage = new SubjectGradebookScoreAndCommentPage(page);
    this.classPage = new ClassPage(page);
    this.logger = new Logger('NavigationMenuActions');
  }

  // ── Sổ điểm mẫu ─────────────────────────────────────────────────────────

  /** Menu: Sổ điểm -> Thiết lập sổ điểm mẫu → Sổ điểm mẫu môn học */
  async navigateToSubjectGradebookTemplateViaMenu(): Promise<void> {
    this.logger.step('Menu: Sổ điểm/ Gradebook');
    await this.menuPage.waitForElement(this.menuPage.gradebookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradebookMenu);

    this.logger.step('Menu con: Thiết lập sổ điểm mẫu/Graebook management');
    await this.menuPage.waitForElement(this.menuPage.gradebookManagementMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradebookManagementMenu);

    this.logger.step('Mục : Sổ điểm mẫu môn học/ Subject gradebook templates');
    await this.menuPage.waitForElement(this.menuPage.subjectGradebookTemplateMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.subjectGradebookTemplateMenu);

    await this.subjectGradebookTemplatePage.waitForPageLoad();
    await this.subjectGradebookTemplatePage.waitForElement(this.subjectGradebookTemplatePage.templateTable, TIMEOUTS.LONG);
  }

  // ── Danh sách sổ điểm mẫu ───────────────────────────────────────────────

  /** Menu: Sổ điểm →  DS sổ điểm mẫu môn học*/
  async navigateToGradingBookViewsList(): Promise<void> {
    this.logger.step('Menu: Sổ điểm/ Gradebook');
    await this.menuPage.waitForElement(this.menuPage.gradebookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradebookMenu);

    this.logger.step('Menu con: Thiết lập sổ điểm mẫu');
    await this.menuPage.waitForElement(this.menuPage.gradebookManagementMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradebookManagementMenu);

    this.logger.step('Mục: DS sổ điểm mẫu môn học/ Subject gradebook list');
    await this.menuPage.waitForElement(this.menuPage.subjectGradebookListMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.subjectGradebookListMenu);

    await this.subjectGradebookListPage.waitForPageLoad();
    await this.subjectGradebookListPage.waitForElement(
      this.subjectGradebookListPage.programSearchInput,
      TIMEOUTS.LONG,
    );
    await this.page.waitForTimeout(2000);
  }

  // ── Lớp học ──────────────────────────────────────────────────────────────

  /** Menu: School management → Classes → Class list */
  async navigateToClassList(): Promise<void> {
    this.logger.step('Menu: Quản lí trường học/ School management');
    await this.menuPage.waitForElement(this.menuPage.schoolManagementMenu, TIMEOUTS.MEDIUM);
    const classVisible = await this.menuPage.classMenu.isVisible();
    if (!classVisible) {
      await this.menuPage.clickElement(this.menuPage.schoolManagementMenu);
    }

    this.logger.step('Menu con: Lớp Chủ nhiệm/ Classes');
    await this.menuPage.waitForElement(this.menuPage.classMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.classMenu);

    this.logger.step('Mục: Danh sách/ Class list');
    await this.classPage.waitForElement(this.menuPage.classListItem, TIMEOUTS.MEDIUM);
    await this.classPage.clickElement(this.menuPage.classListItem);
    await this.classPage.waitForPageLoad();
    await this.page.waitForTimeout(2000);
  }

  // ── Sổ điểm môn học ──────────────────────────────────────────────────────

  /** Menu: Sổ điểm → Điểm nhận xét môn học */
  async navigateToScoreGradebookList(): Promise<void> {
    this.logger.step('Menu: Sổ điểm/ Gradebook');
    await this.menuPage.waitForElement(this.menuPage.gradebookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradebookMenu);

    this.logger.step('Mục: Điểm nhận xét môn học/ Subject\'s scores - comments');
    await this.menuPage.waitForElement(this.menuPage.subjectGradebookScoreAndCommentItem, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.subjectGradebookScoreAndCommentItem);

    await this.subjectGradebookScoreAndCommentPage.waitForPageLoad();
    await this.subjectGradebookScoreAndCommentPage.waitForElement(
      this.subjectGradebookScoreAndCommentPage.listGrid,
      TIMEOUTS.LONG,
    );
    await this.page.waitForTimeout(1500);
  }
}
