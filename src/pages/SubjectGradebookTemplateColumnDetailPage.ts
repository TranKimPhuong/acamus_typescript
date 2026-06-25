import { Page, Locator } from '@playwright/test';
import { BasePage } from '../libs/BasePage';

/**
 * Trang chi tiết / cập nhật của một cột điểm (grading item)
 * URL dạng: /subject-grading-book-templates/{id}/update
 *
 * ⚠️  Selector dựa trên pattern Angular reactive form (formcontrolname) + DevExtreme.
 *     Nếu selector sai hãy inspect DOM thực tế và điều chỉnh cho khớp.
 */
export class SubjectGradebookTemplateColumnDetailPage extends BasePage {

  // Chờ trang detail load xong — element này phải xuất hiện trước khi assert
  readonly detailForm: Locator;

  // Nút Close trên trang column detail
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Adjust nếu trang dùng class khác — ưu tiên form hoặc container chính
    this.detailForm = page.locator('form, [class*="detail"], [class*="update"]').first();
    this.closeButton = page.locator('.footer.bg-white dx-button[aria-label="Close"]');
  }

  // ── Thông tin cơ bản ───────────────────────────────────────────────────────

  /**
   * Mã cột — thường là DxTextBox disabled/readonly trên form.
   * ⚠️ Điều chỉnh formcontrolname nếu backend dùng tên field khác.
   */
  codeValue(): Locator {
    return this.page
      .locator('[formcontrolname="code"] input, input[id*="code"], input[name*="code"]')
      .first();
  }

  /**
   * Tên cột — textbox được associate với label "Grade item name: *".
   */
  nameValue(): Locator {
    return this.page.getByRole('textbox', { name: 'Grade item name: *' });
  }

  /**
   * Tên hiển thị trên báo cáo (reportName) — DxTextBox (dùng để highlight).
   */
  reportNameValue(): Locator {
    return this.page
      .locator('.dx-popup-content')
      .locator('input.dx-texteditor-input[name="reportName"]');
  }

  /**
   * Đọc giá trị reportName trực tiếp qua DOM property (như gõ input.value trên Console).
   * Tránh các vấn đề locator timeout của DevExtreme.
   */
  async getReportNameValue(): Promise<string | null> {
    return this.page.evaluate(() => {
      const input = document.querySelector(
        '.dx-popup-content input[name="reportName"]'
      ) as HTMLInputElement | null;
      return input ? input.value : null;
    });
  }

  /**
   * Hệ số (weight) — DxNumberBox hoặc DxTextBox.
   */
  weightValue(): Locator {
    return this.page
      .locator('.dx-numberbox input.dx-texteditor-input')
      .first();
  }

  /**
   * Loại chấm điểm (gradingType) — hidden input lưu numeric value (không phải text label).
   * DOM: <input type="hidden" name="gradingType" value="2">
   * Dùng toHaveAttribute('value', ...) để assert, KHÔNG dùng toHaveValue.
   */
  gradingTypeValue(label: string): Locator {
    return this.page
      .locator('.dx-field-item')
      .filter({ has: this.page.locator('.dx-field-item-label-text', { hasText: label }) })
      .locator('input[type="hidden"][name="gradingType"]')
      .first();
  }

  /**
   * Thang điểm / Grading scheme (gradingMechanism) — DxSelectBox hoặc DxTagBox.
   */
  gradingMechanismValue(): Locator {
    return this.page
      .locator('dx-select-box[itemtemplate="item"] .dx-texteditor-input')
      .first();
  }

  /**
   * Thuộc nhóm cột điểm (parent) — DxSelectBox, lấy visible input để assert bằng toHaveValue.
   */
  parentValue(): Locator {
    return this.page
      .locator('input[name="parentId"] + * input[type="text"]')
      .first();
  }

  /**
   * Thuộc học kì (semester) — DxSelectBox, lấy visible input để assert bằng toHaveValue.
   */
  semesterValue(): Locator {
    return this.page
      .locator('.dx-field-item')
      .filter({ has: this.page.locator('input[name="semesterId"]') })
      .locator('input.dx-texteditor-input')
      .first();
  }

  // ── Checkboxes (DxCheckBox) ────────────────────────────────────────────────
  // DevExtreme DxCheckBox lưu trạng thái qua class "dx-checkbox-checked" trên container.
  // Dùng expect(locator).toHaveClass(/dx-checkbox-checked/) để kiểm tra checked.

  /**
   * gradingInput.isReadOnly = true → UI hiển thị MỘT dx-checkbox read-only (aria-readonly="true")
   * với text "ReadOnly". KHÔNG có isInputOrImportExcel / isFromTeacherGradebook.
   */
  gradingInputReadOnlyCheckbox(): Locator {
    return this.page
      .locator('dx-check-box[aria-readonly="true"].dx-checkbox, dx-check-box.dx-state-readonly.dx-checkbox')
      .first();
  }

  /**
   * gradingInput.isInputOrImportExcel — checkbox tương tác, chỉ hiển thị khi isReadOnly = false.
   * Cả hai checkbox (isInputOrImportExcel + isFromTeacherGradebook) nằm cùng 1 row nên
   * scope vào row chứa label "Input or excel import" rồi lấy dx-check-box đầu tiên (nth 0).
   */
  isInputOrImportExcelCheckbox(): Locator {
    return this.page
      .locator('.dx-field-item:has-text("Input or excel import") dx-check-box')
      .nth(0);
  }

  /**
   * gradingInput.isFromTeacherGradebook — checkbox tương tác, chỉ hiển thị khi isReadOnly = false.
   * Cùng row với isInputOrImportExcel → lấy dx-check-box thứ hai (nth 1) trong row đó.
   */
  isFromTeacherGradebookCheckbox(): Locator {
    return this.page
      .locator('.dx-field-item:has-text("Select from teacher gradebook") dx-check-box')
      .nth(1);
  }

  /** Làm tròn điểm (isRounded)
   *  - label "Is rounded" và dx-switch nằm 2 div anh em trong cùng dx-field-item
   *  - filter({ has }) kiểm tra descendant → đúng dù khác div
   *  - hidden input bên trong KHÔNG có name → không thể dùng [name="isRounded"]
   */
  isRoundedCheckbox(): Locator {
    return this.page
      .locator('.dx-field-item')
      .filter({
        has: this.page.locator('.dx-field-item-label-text', { hasText: 'Is rounded' })
      })
      .locator('dx-switch:not(.overlay-switch)');
  }

  /** Hiển thị trên báo cáo (isDisplayOnTotalScoreGradeBook) */
  isDisplayOnTotalScoreGradeBookCheckbox(): Locator {
    return this.page.locator('[name="isDisplayOnTotalScoreGradeBook"]')
    .locator('xpath=ancestor::div[@role="checkbox"]');
  }

  /** Đồng bộ sang Canvas (isSyncToCanvas) — label ~ sibling div → dx-check-box */
  isSyncToCanvasCheckbox(label: string): Locator {
    const labelText = label.replace(/:$/, '');
    return this.page
      .locator(`label.dx-field-item-label:has-text("${labelText}") ~ div dx-check-box.dx-checkbox`);
  }

  // ── Scheme tính toán (chỉ cột Calculation) ────────────────────────────────

  /**
   * Kiểu tính toán (calculationType) — text input của DxSelectBox (role="combobox").
   * Dùng toHaveValue(label) để assert text hiển thị — KHÔNG dùng toHaveAttribute.
   */
  calculationTypeDisplay(): Locator {
    return this.page
      .locator('dx-select-box[displayexpr="description"] input[type="hidden"]')
      .first();
  }

  /**
   * Tag/chip của từng cột con tham gia tính toán.
   * Scope vào dx-tag-box[displayexpr="name"] — đúng với DOM thực tế.
   * Text so sánh là TÊN hiển thị (displayexpr="name"), không phải code.
   */
  subItemTag(name: string): Locator {
    return this.page
      .locator('dx-tag-box[displayexpr="name"][valueexpr="id"] .dx-tag-content')
      .filter({ hasText: name })
      .first();
  }

  /**
   * Tất cả tags trong DxTagBox "Cột điểm để tính tự động".
   * Dùng để assert COUNT và TEXT.
   * DOM: dx-tag-box[displayexpr="name"] > .dx-tag-container > .dx-tag > .dx-tag-content
   */
  calculatedItemTagsAll(): Locator {
    return this.page.locator(
      'dx-tag-box[displayexpr="name"][valueexpr="id"] .dx-tag-container .dx-tag-content'
    );
  }

  /**
   * Số cột để tính (columnsToCalculate) — DxNumberBox input.
   */
  columnsToCalculateInput(): Locator {
    return this.page.locator('input[name="columnsToCalculate"]').first();
  }

  /**
   * STT (lineNumber) — DxNumberBox spinbutton trong field item optional cột 1.
   */
  lineNumberInput(): Locator {
    return this.page.locator('.dx-col-1.dx-field-item-optional dx-number-box input[role="spinbutton"]');
  }
}
