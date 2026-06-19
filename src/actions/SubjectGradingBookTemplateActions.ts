import { Page, expect } from '@playwright/test';
import { SubjectGradingBookTemplatePage } from '../pages/SubjectGradingBookTemplatePage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { GradingBookTemplate } from '../constants/GradingBookConstants';
import { TIMEOUTS } from '../constants/LoginConstants';

export class SubjectGradingBookTemplateActions {
  private page: Page;
  private templatePage: SubjectGradingBookTemplatePage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.templatePage = new SubjectGradingBookTemplatePage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('SubjectGradingBookTemplateActions');
  }

  async assertTemplateExistsByCode(code: string): Promise<void> {
    this.logger.step(`Assert template với code "${code}" visible`);
    await expect(this.templatePage.templateCodeCell(code)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertTemplateExistsByName(name: string): Promise<void> {
    this.logger.step(`Assert template với name "${name}" visible`);
    await expect(this.templatePage.templateNameCell(name)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertTemplateExists(template: GradingBookTemplate): Promise<void> {
    this.logger.step(`Assert template: code="${template.code}", name="${template.name}"`);
    await this.assertTemplateExistsByCode(template.code);
    await this.assertTemplateExistsByName(template.name);
  }

  async assertAllSystemTemplatesExist(templates: GradingBookTemplate[]): Promise<void> {
    this.logger.step(`Assert tất cả ${templates.length} system templates`);
    for (const template of templates) {
      await this.assertTemplateExists(template);
    }
  }

  async assertTemplateListUrl(): Promise<void> {
    this.logger.step('Assert URL là trang danh sách sổ điểm mẫu');
    await expect(this.page).toHaveURL(new RegExp('subject-grading-book-templates/list'), {
      timeout: TIMEOUTS.MEDIUM,
    });
  }
}
