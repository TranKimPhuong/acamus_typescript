import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectScoreGradebookListPage extends BasePage {
  // Main data grid on the list page
  readonly listGrid: Locator;

  // Search / filter input (to filter by class name)
  readonly searchInput: Locator;

  // "Lọc" or "Tìm kiếm" button (if present)
  readonly searchButton: Locator;

  // Dropdown to select class / lớp chủ nhiệm
  readonly classDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.listGrid = page.locator('.dx-datagrid, .ant-table, [class*="grid"], [class*="table"]').first();

    this.searchInput = page.locator(
      'input[placeholder*="Tìm"], input[placeholder*="tìm kiếm"], input[placeholder*="Search"]'
    ).first();

    this.searchButton = page.locator(
      'button:has-text("Tìm kiếm"), button:has-text("Lọc"), button:has-text("Search")'
    ).first();

    // Dropdown that filters by class (Lớp chủ nhiệm / lớp bộ môn)
    this.classDropdown = page.locator(
      'div:has(span:has-text("Lớp")) > a[role="button"], ' +
      'div:has(span:has-text("Lớp chủ nhiệm")) > a[role="button"], ' +
      '.ant-select:has(span:has-text("Lớp")), ' +
      '[placeholder*="Chọn lớp"]'
    ).first();
  }

  // ── Dynamic locators ─────────────────────────────────────────────────────

  /** All data rows in the list grid */
  get dataRows(): Locator {
    return this.page.locator('.dx-data-row, tbody tr[class*="row"], tbody tr');
  }

  /**
   * All rows that contain the given class name text.
   * Used to get the count of courses for a class and click each one.
   */
  rowsContaining(className: string): Locator {
    return this.page.locator(
      `.dx-data-row:has-text("${className}"), ` +
      `tbody tr:has-text("${className}")`
    );
  }

  /**
   * nth row matching the class name (0-indexed).
   * Used to iterate over all courses for a class.
   */
  nthRowContaining(className: string, index: number): Locator {
    return this.rowsContaining(className).nth(index);
  }

  /**
   * Clickable link / button inside a course row to open the score entry view.
   * DevExtreme grids often have an anchor with class link-opacity-100 or a custom cell.
   */
  openScoreEntryButton(rowLocator: Locator): Locator {
    return rowLocator.locator(
      'a.link-opacity-100, a[href*="subject-score"], button:has-text("Nhập điểm"), ' +
      'button:has-text("Mở"), td a'
    ).first();
  }
}
