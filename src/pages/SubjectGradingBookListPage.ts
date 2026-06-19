import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradingBookListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Row in the grading book views list matching the given grade block name */
  gradeBlockRow(gradeBlock: string): Locator {
    return this.page.locator(
      `tr:has-text("${gradeBlock}"), ` +
      `.dx-data-row:has-text("${gradeBlock}"), ` +
      `[class*="item"]:has-text("${gradeBlock}")`
    ).first();
  }
}
