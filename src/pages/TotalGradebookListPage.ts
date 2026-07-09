import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class TotalGradebookListPage extends BasePage {
  /** Ô tagbox chọn Khối để lọc */
  readonly gradeFilterInput: Locator;
  /** Nút "Lọc" */
  readonly filterButton: Locator;
  /** Nút "OK" xác nhận lựa chọn trong popup tagbox */
  readonly dropdownConfirmButton: Locator;

  constructor(page: Page) {
    super(page);

    this.gradeFilterInput = page.locator('form[name="filterForm"] input.dx-texteditor-input').first();
    this.filterButton = page.locator('dx-button:has-text("Lọc"):not(:has-text("Bỏ")), dx-button:has-text("Filter"):not(:has-text("Clear"))').first();
    this.dropdownConfirmButton = page.getByRole('button', { name: 'OK', exact: true });
  }

  /** Item Khối trong dropdown tagbox */
  gradeDropdownItem(gradeName: string): Locator {
    return this.page
      .locator('.dx-list-item')
      .filter({ hasText: new RegExp(`^${gradeName}$`) })
      .first();
  }

  /** Row của một Khối cụ thể trong bảng */
  gradeRow(gradeName: string): Locator {
    return this.page.locator(`tr.dx-data-row:has(td:text-is("${gradeName}")):visible`).first();
  }

  /** Giá trị cột "Sổ điểm mẫu tổng kết" trong row của Khối */
  gradebookTemplateCell(gradeName: string): Locator {
    const row = this.gradeRow(gradeName);
    return row.locator('td[aria-colindex="3"]').first();
  }

  /**
   * Cột Action bị fixed nên DevExtreme render 2 bảng song song cho cùng 1 dòng — xem
   * giải thích tương tự ở SubjectGradebookListPage.actionIcon().
   */
  private actionIcon(gradeName: string, iconSelector: string): Locator {
    return this.page
      .locator(
        `td[aria-colindex="4"]:not(.dx-hidden-cell) ${iconSelector}:near(tr.dx-data-row:has(td:text-is("${gradeName}")), 5)`
      )
      .first();
  }

  /** Icon "+" (tạo mới) — chỉ hiện khi Khối chưa có sổ điểm mẫu tổng kết */
  addIcon(gradeName: string): Locator {
    return this.actionIcon(gradeName, 'a.grid-command:not(.grid-command-edit):not(.grid-command-delete)');
  }

  /** Icon edit — chỉ hiện khi Khối đã có sổ điểm mẫu tổng kết */
  editIcon(gradeName: string): Locator {
    return this.actionIcon(gradeName, 'a.grid-command-edit');
  }

  /** Icon xóa — chỉ hiện khi Khối đã có sổ điểm mẫu tổng kết */
  deleteIcon(gradeName: string): Locator {
    return this.actionIcon(gradeName, 'a.grid-command-delete');
  }
}
