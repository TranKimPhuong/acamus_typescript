import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradingBookTemplatePage extends BasePage {
  readonly pageTitle: Locator;
  readonly templateTable: Locator;
  readonly tableRows: Locator;
  readonly loadingSpinner: Locator;

  // Column locators within a row — pass text of the code cell
  templateRowByCode(code: string): Locator {
    return this.page.locator(`tr:has-text("${code}"), [class*="row"]:has-text("${code}")`).first();
  }

  templateCodeCell(code: string): Locator {
    // Click đúng thẻ <a> trong dx-template-wrapper — đây là link navigate sang detail
    return this.page
      .locator('div.dx-template-wrapper a.link-opacity-100')
      .filter({ hasText: new RegExp(`^${code}$`) })
      .first();
  }

  templateNameCell(name: string): Locator {
    return this.page.locator(`td:has-text("${name}"), [class*="cell"]:has-text("${name}")`).first();
  }

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator(
      'h1:has-text("Sổ điểm mẫu"), h2:has-text("Sổ điểm mẫu"), .page-title:has-text("Sổ điểm mẫu"), [class*="title"]:has-text("Sổ điểm mẫu")'
    ).first();

    this.templateTable = page.locator(
      'table, .ant-table, [class*="table"]'
    ).first();

    this.tableRows = page.locator('tbody tr, .ant-table-row, [class*="table-row"]');

    this.loadingSpinner = page.locator(
      '.ant-spin, [class*="loading"], [class*="spinner"]'
    ).first();
  }
}
