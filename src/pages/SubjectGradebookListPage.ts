import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

export class SubjectGradebookListPage extends BasePage {
  /** Ô tìm kiếm tên chương trình */
  readonly programSearchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.programSearchInput = page.locator(
      'input[placeholder*="chương trình"], input[placeholder*="tên"], input[placeholder*="Tìm"], .dx-texteditor-input'
    ).first();
  }

  /** Row in the grading book views list matching the given grade block name */
  gradeBlockRow(gradeBlock: string): Locator {
    return this.page.locator(`tr.dx-group-row:has-text("${gradeBlock}")`).first();
  }

  /** Ô lọc/tìm kiếm trong header cột tên chương trình (DevExtreme filter row) */
  programFilterCell(): Locator {
    return this.page.locator(
      'input[name="program"]').first();
  }

  /** Row của một môn học cụ thể trong bảng */
  subjectRow(subjectName: string): Locator {
    return this.page.locator(`tr.dx-data-row:has(td:text-is("${subjectName}")):visible`).first();
  }

  /** Giá trị cột "Sổ điểm mẫu môn học" trong row của môn học */
  gradebookTemplateCell(subjectName: string): Locator {
    const row = this.subjectRow(subjectName);
    return row.locator('td[aria-colindex="4"]').first();
  }

  /**
   * Cột Action bị fixed nên DevExtreme render 2 bảng song song cho cùng 1 dòng:
   * bảng chính (chứa tên môn, ẩn cột Action bằng .dx-hidden-cell) và bảng fixed-column
   * (chứa icon Action thật). subjectRow() chỉ tìm được dòng ở bảng chính nên phải dùng
   * :near() để bắt đúng icon ở bảng fixed-column theo vị trí trên màn hình.
   */
  private actionIcon(subjectName: string, iconSelector: string): Locator {
    return this.page
      .locator(
        `td[aria-colindex="5"]:not(.dx-hidden-cell) ${iconSelector}:near(tr.dx-data-row:has(td:text-is("${subjectName}")), 5)`
      )
      .first();
  }

  /** Icon "+" (tạo mới) — chỉ hiện khi môn học chưa có sổ điểm mẫu */
  addIcon(subjectName: string): Locator {
    return this.actionIcon(subjectName, 'a.grid-command:not(.grid-command-edit):not(.grid-command-delete)');
  }

  /** Icon edit — chỉ hiện khi môn học đã có sổ điểm mẫu */
  editIcon(subjectName: string): Locator {
    return this.actionIcon(subjectName, 'a.grid-command-edit');
  }

  /** Icon xóa — chỉ hiện khi môn học đã có sổ điểm mẫu */
  deleteIcon(subjectName: string): Locator {
    return this.actionIcon(subjectName, 'a.grid-command-delete');
  }
}
