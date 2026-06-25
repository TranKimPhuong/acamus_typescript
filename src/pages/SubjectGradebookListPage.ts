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
    return this.page.locator(
      `tr:has-text("${subjectName}"), .dx-data-row:has-text("${subjectName}")`
    ).first();
  }

  /** Giá trị cột "Sổ điểm mẫu môn học" trong row của môn học */
  gradebookTemplateCell(subjectName: string): Locator {
    const row = this.subjectRow(subjectName);
    return row.locator('td[aria-colindex="4"]').first();
  }
}
