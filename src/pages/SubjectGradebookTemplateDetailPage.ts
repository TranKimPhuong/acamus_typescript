import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradebookTemplateDetailPage extends BasePage {
  parentGroupInRow(code: string): Locator {
    throw new Error('Method not implemented.');
  }
  // ── Bảng cấu hình cột ────────────────────────────────────────────────────
  readonly columnConfigTable: Locator;
  readonly columnRows: Locator;

  // ── Thông tin chung ───────────────────────────────────────────────────────
  readonly numericSchemeValue: Locator;
  readonly mddSchemeValue: Locator;

  templateNameInput(name: string): Locator {
    return this.page.locator(`input[value="${name}"]`);
  }

  // ── Lấy row theo mã cột ──────────────────────────────────────────────────
  // .dx-scrollable-content chỉ bao bảng chính, không bao bảng fixed-column
  columnRowByCode(code: string): Locator {
    return this.page.locator(
      `.dx-scrollable-content table > tbody[role="presentation"] tr.dx-data-row:has(td:has-text("${code}"))`
    ).first();
  }

  // ── Lấy giá trị các ô trong row ──────────────────────────────────────────
  iconEditInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="1"] .dx-template-wrapper > div:last-child a[class*="grid-command-edit"] app-icon-edit svg');
  }

  columnNameInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="1"] .dx-template-wrapper > div:first-child');
  }

  gradingMechanismInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="4"]');
  }

  semesterInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="5"]');
  }

  gradingTypeInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="6"]');
  }

  weightInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="3"] span.me-2');
  }

  lineNumberInRow(code: string): Locator {
    return this.columnRowByCode(code).locator('td[aria-colindex="9"]');
  }

  constructor(page: Page) {
    super(page);

    this.columnConfigTable = page.locator('.dx-treelist').first();

    // .dx-scrollable-content bao bảng chính — bảng fixed column nằm ngoài scope này
    this.columnRows = page.locator(
      '.dx-scrollable-content div table > tbody[role="presentation"] tr.dx-data-row'
    ).first();

    this.numericSchemeValue = page.locator(
      '[class*="numericScheme"], [placeholder*="thang điểm"], span[class*="tag"]:has-text("10"), td:has-text("10") [class*="tag"]'
    ).first();

    this.mddSchemeValue = page.locator(
      '[class*="mddScheme"], [class*="comment-scheme"], span[class*="tag"]:has-text("TH - Đánh giá môn học & hoạt động giáo dục Tiểu học"), td:has-text("TH - Đánh giá môn học & hoạt động giáo dục Tiểu học") [class*="tag"]'
    ).first();
  }
}
