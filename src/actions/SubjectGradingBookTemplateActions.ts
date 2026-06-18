import { Page, expect } from '@playwright/test';
import { SubjectGradingBookTemplatePage } from '../pages/SubjectGradingBookTemplatePage';
import { NavigationMenuPage } from '../pages/NavigationMenuPage';
import { Logger } from '../libs/Logger';
import { GRADING_BOOK_URLS, GradingBookTemplate } from '../constants/GradingBookConstants';
import { TIMEOUTS } from '../constants/LoginConstants';

export class SubjectGradingBookTemplateActions {
  private page: Page;
  private templatePage: SubjectGradingBookTemplatePage;
  private menuPage: NavigationMenuPage;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.templatePage = new SubjectGradingBookTemplatePage(page);
    this.menuPage = new NavigationMenuPage(page);
    this.logger = new Logger('SubjectGradingBookTemplateActions');
  }

  async navigateViaMenu(): Promise<void> {
    this.logger.step('Qua menu chọn Sổ điểm');
    await this.menuPage.waitForElement(this.menuPage.gradingBookMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingBookMenu);

    this.logger.step('Chọn menu con Cơ chế chấm điểm');
    await this.menuPage.waitForElement(this.menuPage.gradingMechanismSubMenu, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingMechanismSubMenu);

    this.logger.step('Chọn Sổ điểm mẫu');
    await this.menuPage.waitForElement(this.menuPage.gradingBookTemplateItem, TIMEOUTS.MEDIUM);
    await this.menuPage.clickElement(this.menuPage.gradingBookTemplateItem);

    await this.templatePage.waitForPageLoad();
    await this.templatePage.waitForElement(this.templatePage.templateTable, TIMEOUTS.LONG);
  }

  async navigateToTemplateList(): Promise<void> {
    this.logger.step('Navigate to grading book template list');
    await this.templatePage.navigate(GRADING_BOOK_URLS.TEMPLATE_LIST);
    await this.templatePage.waitForPageLoad();
    await this.templatePage.waitForElement(this.templatePage.templateTable, TIMEOUTS.LONG);
  }

  async assertTemplateExistsByCode(code: string): Promise<void> {
    this.logger.step(`Assert template with code "${code}" is visible`);
    await expect(this.templatePage.templateCodeCell(code)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertTemplateExistsByName(name: string): Promise<void> {
    this.logger.step(`Assert template with name "${name}" is visible`);
    await expect(this.templatePage.templateNameCell(name)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertTemplateExists(template: GradingBookTemplate): Promise<void> {
    this.logger.step(`Assert template: code="${template.code}", name="${template.name}"`);
    await this.assertTemplateExistsByCode(template.code);
    await this.assertTemplateExistsByName(template.name);
  }

  async assertAllSystemTemplatesExist(templates: GradingBookTemplate[]): Promise<void> {
    this.logger.step(`Assert all ${templates.length} system templates are present`);
    for (const template of templates) {
      await this.assertTemplateExists(template);
    }
  }

  async assertTemplateListUrl(): Promise<void> {
    this.logger.step('Assert current URL is template list page');
    await expect(this.page).toHaveURL(new RegExp('subject-grading-book-templates/list'), {
      timeout: TIMEOUTS.MEDIUM,
    });
  }
}
