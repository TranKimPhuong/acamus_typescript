import { Page, Locator, expect } from '@playwright/test';
import { SubjectGradebookTemplateDetailPage } from '../pages/SubjectGradebookTemplateDetailPage';
import { SubjectGradebookTemplateColumnDetailPage } from '../pages/SubjectGradebookTemplateColumnDetailPage';
import { SubjectGradebookTemplatePage } from '../pages/SubjectGradebookTemplatePage';
import { NavigationMenuActions } from './NavigationMenuActions';
import { Logger } from '../libs/Logger';
import { GradingBookTemplateDetail, ColumnConfig, GRADING_TYPE_VALUE, CALCULATION_TYPE_VALUE } from '../constants/SubjectGradebookTemplateDetailConstants';
import { TIMEOUTS } from '../constants/LoginConstants';

declare const document: any;

export class SubjectGradebookTemplateDetailActions {
  private page: Page;
  private detailPage: SubjectGradebookTemplateDetailPage;
  private columnDetailPage: SubjectGradebookTemplateColumnDetailPage;
  private listPage: SubjectGradebookTemplatePage;
  readonly nav: NavigationMenuActions;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.detailPage = new SubjectGradebookTemplateDetailPage(page);
    this.columnDetailPage = new SubjectGradebookTemplateColumnDetailPage(page);
    this.listPage = new SubjectGradebookTemplatePage(page);
    this.nav = new NavigationMenuActions(page);
    this.logger = new Logger('SubjectGradebookTemplateDetailActions');
  }

  // ── Mở detail ─────────────────────────────────────────────────────────────

  async openTemplateByCode(code: string): Promise<void> {
    this.logger.step(`Chọn sổ điểm mẫu có mã "${code}" từ danh sách`);
    const codeCell = this.listPage.templateCodeCell(code);
    await expect(codeCell).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    await codeCell.click();
    // Không dùng waitForPageLoad (networkidle resolve quá sớm, không đảm bảo đã navigate)
    // Chờ chính xác .dx-treelist — chỉ xuất hiện trên trang detail
    await this.detailPage.waitForElement(this.detailPage.columnConfigTable, TIMEOUTS.LONG);
    await this.page.waitForTimeout(500);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertTemplateName(detail: GradingBookTemplateDetail): Promise<void> {
    const name = (detail as any).name;
    this.logger.step(`Assert tên sổ điểm = "${name}"`);
    await expect(this.detailPage.templateNameInput(name)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertTotalItems(detail: GradingBookTemplateDetail): Promise<void> {
    const expected = detail.columns.length;
    this.logger.step(`Assert tổng số cột = ${expected}`);

    await expect
      .poll(
        async () => {
          return await this.page.evaluate(async (): Promise<number> => {
            // Ưu tiên DevExtreme API — không phụ thuộc DOM structure của virtual scroll
            const el = document.querySelector('.dx-treelist') as any;
            if (!el) return -1;

            try {
              const DevExpress = (window as any).DevExpress;
              const instance = DevExpress?.ui?.dxTreeList?.getInstance(el);
              if (instance) {
                const total = instance.totalCount();
                // Dùng > 0 thay vì >= 0: tránh trả về 0 khi data vẫn đang load
                if (total > 0) return total;
              }
            } catch { /* fallback bên dưới */ }

            // Fallback: scroll thủ công và đếm aria-rowindex unique
            const rowsView = document.querySelector('.dx-treelist-rowsview') as HTMLElement | null;
            if (!rowsView) return -1;

            const scrollEl: HTMLElement =
              (rowsView.querySelector('.dx-scrollable-container') as HTMLElement | null) ?? rowsView;

            const seenIndices = new Set<string>();
            const collectVisible = () => {
              rowsView.querySelectorAll('.dx-data-row').forEach((row) => {
                const idx = (row as Element).getAttribute('aria-rowindex');
                if (idx) seenIndices.add(idx);
              });
            };

            const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

            scrollEl.scrollTop = 0;
            await wait(300);

            while (true) {
              const countBefore = seenIndices.size;
              collectVisible();

              const atBottom = scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 2;
              if (atBottom) { collectVisible(); break; }
              if (seenIndices.size === countBefore && scrollEl.scrollTop > 0) break;

              scrollEl.scrollTop += scrollEl.clientHeight;
              await wait(300);
            }

            return seenIndices.size;
          });
        },
        {
          timeout: TIMEOUTS.LONG,
          intervals: [500, 1000, 1000, 2000, 2000],
          message: `Tổng số cột: expected ${expected}`,
        }
      )
      .toBe(expected);
  }

  // Scroll TreeList cho đến khi row có code xuất hiện trong DOM
  private async scrollRowIntoView(code: string): Promise<void> {
    const rowLocator = this.detailPage.columnRowByCode(code);
    const isAlreadyVisible = await rowLocator.isVisible().catch(() => false);
    if (isAlreadyVisible) return;

    const maxScrolls = 30;
    for (let i = 0; i < maxScrolls; i++) {
      // Dùng DevExtreme scrollable API thay vì set scrollTop trực tiếp
      // để trigger virtual scroll render đúng cách
      await this.page.evaluate(async (stepIndex: number) => {
        const treeListEl = document.querySelector('.dx-treelist') as any;
        if (!treeListEl) return;

        try {
          const DevExpress = (window as any).DevExpress;
          const instance = DevExpress?.ui?.dxTreeList?.getInstance(treeListEl);
          if (instance) {
            const scrollable = instance.getScrollable();
            if (scrollable) {
              const pageHeight = scrollable.clientHeight();
              scrollable.scrollTo({ top: stepIndex * pageHeight });
              return;
            }
          }
        } catch { /* fallback bên dưới */ }

        // Fallback: dùng scrollable container của DevExtreme
        const rowsView = document.querySelector('.dx-treelist-rowsview');
        if (!rowsView) return;
        const scrollContainer = rowsView.querySelector('.dx-scrollable-container') as HTMLElement | null;
        if (!scrollContainer) return;

        const pageHeight = scrollContainer.clientHeight;
        // Dispatch scroll event để DevExtreme nhận biết
        scrollContainer.scrollTop = stepIndex * pageHeight;
        scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));
      }, i);

      // Chờ DOM ổn định sau scroll (polling thay vì fixed wait)
      const appeared = await rowLocator.waitFor({ state: 'visible', timeout: 800 }).then(() => true).catch(() => false);
      if (appeared) return;
    }

    // Nếu vẫn chưa thấy sau maxScrolls, throw rõ ràng thay vì để assert sau fail
    await expect(rowLocator, `Không tìm thấy row "${code}" sau khi scroll hết TreeList`).toBeVisible({
      timeout: TIMEOUTS.MEDIUM,
    });
  }

  async assertColumnExists(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - row visible`);
    const row = this.detailPage.columnRowByCode(col.code);
    await expect(row).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnName(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - tên = "${col.name}"`);
    const nameCell = this.detailPage.columnNameInRow(col.name);
    await expect(nameCell).toHaveText(col.name, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnGradingMechanism(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - cơ chế chấm điểm = "${col.gradingMechanism || 'empty'}"`);
    const cell = this.detailPage.gradingMechanismInRow(col.code);
    if (col.gradingMechanism === '') {
      await expect(async () => {
        const text = ((await cell?.textContent()) ?? '').replace(/[ \s]/g, '');
        expect(text).toBe('');
      }).toPass({ timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(cell).toContainText(col.gradingMechanism, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnSemesterCode(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - thuộc học kỳ = "${col.semesterCode || 'empty'}"`);
    const cell = this.detailPage.semesterInRow(col.code);
    if (col.semesterCode === '') {
      await expect(async () => {
        const text = ((await cell?.textContent()) ?? '').replace(/[ \s]/g, '');
        expect(text).toBe('');
      }).toPass({ timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(cell).toContainText(col.semesterCode, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnParent(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - thuộc nhóm = "${col.parentGroup || 'empty'}"`);
    const cell = this.detailPage.parentGroupInRow(col.code);
    if (col.parentGroup === '') {
      await expect(async () => {
        const text = ((await cell?.textContent()) ?? '').replace(/[ \s]/g, '');
        expect(text).toBe('');
      }).toPass({ timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(cell).toContainText(col.parentGroup, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnGradingType(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - loại chấm điểm = "${col.gradingType}"`);
    const typeCell = this.detailPage.gradingTypeInRow(col.code);
    await expect(typeCell).toContainText(col.gradingType, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnWeight(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - trọng số = "${col.weight === '' ? 'empty' : col.weight}"`);
    if (col.weight === '') {
      // Weight rỗng → span.me-2 không render, kiểm tra trực tiếp trên td
      const td = this.detailPage.columnRowByCode(col.code).locator('td[aria-colindex="3"]');
      await expect(td).toHaveText('', { timeout: TIMEOUTS.MEDIUM });
    } else {
      // Weight có giá trị → nằm trong <span class="me-2"> bên trong td
      const weightSpan = this.detailPage.weightInRow(col.code);
      await expect(weightSpan).toHaveText(col.weight, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnLineNumber(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert cột "${col.code}" - số thứ tự = empty`);
    const lineCell = this.detailPage.lineNumberInRow(col.code);
    // td hiển thị &nbsp; ( ) khi rỗng — strip hết whitespace/nbsp trước khi so sánh
    await expect(async () => {
      const text = (await lineCell.textContent() ?? '').replace(/[ \s]/g, '');
      expect(text).toBe('');
    }).toPass({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertFinalScore(expected: string): Promise<void> {
    this.logger.step(`Assert cột điểm tổng kết = "${expected}" (dòng tồn tại trong bảng)`);
    // ForPageLoad không đảm bảo table đã render xong, nên scroll thủ công đến row finalScore để trigger render nếu cần, rồi assert row visible.
    await this.scrollRowIntoView(expected);
    await this.page.waitForTimeout(150);
    await expect(this.detailPage.columnRowByCode(expected)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertNumericGradingScheme(expected: string): Promise<void> {
    this.logger.step(`Assert thang điểm số = "${expected}"`);
    await expect(this.detailPage.numericSchemeValue).toContainText(expected, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertMddGradingScheme(expected: string): Promise<void> {
    this.logger.step(`Assert thang MDD = "${expected}"`);
    await expect(this.detailPage.mddSchemeValue).toContainText(expected, { timeout: TIMEOUTS.MEDIUM });
  }

  // ── Assert toàn bộ detail một lần ─────────────────────────────────────────

  private async highlightRow(code: string): Promise<void> {
    await this.page.evaluate((rowCode: string) => {
      // Xóa highlight cũ
      document.querySelectorAll('[data-pw-highlight]').forEach((el: Element) => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.backgroundColor = '';
        el.removeAttribute('data-pw-highlight');
      });

      // Tìm row khớp code và highlight
      const rows = document.querySelectorAll(
        '.dx-scrollable-content table > tbody[role="presentation"] tr.dx-data-row'
      );
      for (const row of Array.from<Element>(rows)) {
        const matched = Array.from<Element>(row.querySelectorAll('td')).some(
          (td) => td.textContent?.trim() === rowCode
        );
        if (matched) {
          (row as HTMLElement).style.outline = '2px solid orange';
          (row as HTMLElement).style.backgroundColor = 'rgba(255, 165, 0, 0.15)';
          row.setAttribute('data-pw-highlight', 'true');
          break;
        }
      }
    }, code);
    // Dừng nhẹ để highlight visible trong video/screenshot
    await this.page.waitForTimeout(150);
  }

  /**
   * Highlight field đang được kiểm tra trên trang column detail.
   * Nếu locator trỏ vào input/textarea bên trong DevExtreme widget, tự động
   * walk up lên container widget để outline bao phủ cả label + control.
   * Dùng attribute "data-pw-field-highlight" (tách biệt với data-pw-highlight của row).
   * Lỗi highlight không fail test — chỉ là UI aid cho video/screenshot.
   */
  private async highlightField(locator: Locator): Promise<void> {
    try {
      await locator.evaluate((el: HTMLElement) => {
        // Xóa highlight field cũ
        document.querySelectorAll('[data-pw-field-highlight]').forEach((prev: Element) => {
          (prev as HTMLElement).style.outline = '';
          (prev as HTMLElement).style.backgroundColor = '';
          prev.removeAttribute('data-pw-field-highlight');
        });

        // Walk up lên DevExtreme widget container khi el là input/textarea bên trong
        let target: HTMLElement = el;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          target =
            (el.closest('[formcontrolname], .dx-widget, .dx-field-item') as HTMLElement) ?? el;
        }

        target.style.outline = '2px solid orange';
        target.style.backgroundColor = 'rgba(255, 165, 0, 0.15)';
        target.setAttribute('data-pw-field-highlight', 'true');
        target.scrollIntoView({ block: 'nearest' });
      });
      await this.page.waitForTimeout(150);
    } catch {
      // Non-critical — không block test
    }
  }

  /** Xóa tất cả highlight field sau khi assert xong một cột */
  private async clearFieldHighlight(): Promise<void> {
    try {
      await this.page.evaluate(() => {
        document.querySelectorAll('[data-pw-field-highlight]').forEach((el: Element) => {
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.backgroundColor = '';
          el.removeAttribute('data-pw-field-highlight');
        });
      });
    } catch {
      // Non-critical
    }
  }

  async assertAllColumnConfigs(detail: GradingBookTemplateDetail): Promise<void> {
    this.logger.step('Assert tất cả cấu hình cột');
    const total = detail.columns.length;
    for (let i = 0; i < total; i++) {
      const col = detail.columns[i];
      this.logger.step(`--- [${i + 1}/${total}] Kiểm tra dòng: ${col.code} ---`);
      await this.scrollRowIntoView(col.code);
      await this.highlightRow(col.code);
      await this.assertColumnExists(col);
      await this.assertColumnName(col);
      await this.assertColumnGradingMechanism(col);
      //await this.assertColumnParent(col);
      await this.assertColumnSemesterCode(col);
      await this.assertColumnGradingType(col);
      await this.assertColumnWeight(col);
      await this.assertColumnLineNumber(col);
    }

    // Xóa highlight sau khi check xong toàn bộ
    await this.page.evaluate(() => {
      document.querySelectorAll('[data-pw-highlight]').forEach((el: Element) => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.backgroundColor = '';
        el.removeAttribute('data-pw-highlight');
      });
    });
  }

  async assertFullDetail(detail: GradingBookTemplateDetail): Promise<void> {
    this.logger.step(`Assert toàn bộ default values của sổ điểm "${detail.code}"`);

    await this.assertTotalItems(detail);
    await this.assertFinalScore(detail.finalScore);
    await this.assertAllColumnConfigs(detail);
  }

  // ── subGradingItem — trang chi tiết riêng ─────────────────────────────────

  /** Click vào row của cột để navigate sang trang column detail */
  private async openColumnDetail(code: string): Promise<void> {
    this.logger.step(`Mở chi tiết cột "${code}"`);
    const row = this.detailPage.columnRowByCode(code);
    await expect(row).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

    const editIcon = this.detailPage.iconEditInRow(code);
    // Chờ element có trong DOM (không cần visible vì icon bị ẩn bởi CSS)
    await editIcon.waitFor({ state: 'attached', timeout: TIMEOUTS.MEDIUM });

    // Highlight để dễ quan sát trong video/screenshot
    await editIcon.evaluate((el: HTMLElement) => {
      el.style.outline = '2px solid orange';
      el.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
    });
    await this.page.waitForTimeout(150);

    // force: true để bypass visibility check — element ẩn bởi CSS nhưng có thể click
    await editIcon.click({ force: true });
    // Chờ URL đổi sang trang update
    await this.page.waitForURL(/\/update/, { timeout: TIMEOUTS.LONG });
    await this.columnDetailPage.waitForElement(this.columnDetailPage.detailForm, TIMEOUTS.LONG);
  }

  /** Quay về trang template detail sau khi check column detail */
  private async closeColumnDetail(): Promise<void> {
    this.logger.step('Quay lại trang template detail');
    await this.columnDetailPage.closeButton.click();
    await this.detailPage.waitForElement(this.detailPage.columnConfigTable, TIMEOUTS.LONG);
  }

  /**
   * Assert trạng thái DxCheckBox qua class "dx-checkbox-checked" trên container.
   * DevExtreme không dùng <input type="checkbox"> nên không thể dùng .isChecked().
   */
  private async assertDxCheckbox(locator: Locator, expected: boolean, fieldName: string): Promise<void> {
    this.logger.step(`  Assert ${fieldName} = ${expected}`);
    await this.highlightField(locator);
    if (expected) {
      await expect(locator, `${fieldName} phải ở trạng thái checked`).toHaveClass(
        /dx-checkbox-checked/, { timeout: TIMEOUTS.MEDIUM }
      );
    } else {
      await expect(locator, `${fieldName} phải ở trạng thái unchecked`).not.toHaveClass(
        /dx-checkbox-checked/, { timeout: TIMEOUTS.MEDIUM }
      );
    }
  }

  /**
   * Assert trạng thái DxSwitch qua aria-pressed: true → ON, false → OFF.
   * Locator trỏ thẳng vào <dx-switch> — highlight xong check attribute trên chính element đó.
   */
  private async assertDxSwitch(locator: Locator, expected: boolean, fieldName: string): Promise<void> {
    this.logger.step(`  Assert ${fieldName} = ${expected ? 'ON' : 'OFF'}`);
    await this.highlightField(locator);
    await expect(
      locator,
      `${fieldName} phải ở trạng thái ${expected ? 'ON' : 'OFF'}`
    ).toHaveAttribute('aria-pressed', expected ? 'true' : 'false', { timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Assert sub-grading items của cột Calculation: calculationType + từng calculatedItem.
   * Chỉ gọi hàm này khi col.scheme !== undefined.
   *
   * Quy trình:
   * 1. Assert calculationType (hidden input value)
   * 2. Assert số lượng tag trong dropdown = calculatedItems.length
   * 3. Assert tên từng tag khớp chính xác (không thừa, không thiếu)
   */
  async assertColumnSubGradingItemDetail(col: ColumnConfig): Promise<void> {
    if (!col.scheme) {
      this.logger.step(`Cột "${col.code}" không có scheme — bỏ qua`);
      return;
    }
    this.logger.step(`Assert subGradingItems của cột "${col.code}"`);

    // 1. calculationType — hidden input lưu numeric ID
    const expectedCalcTypeLabel = col.scheme.calculationType;
    const expectedCalcTypeId    = CALCULATION_TYPE_VALUE[expectedCalcTypeLabel] ?? expectedCalcTypeLabel;
    this.logger.step(`  Assert calculationType = "${expectedCalcTypeLabel}" (id="${expectedCalcTypeId}")`);
    await this.highlightField(this.columnDetailPage.calculationTypeDisplay());
    await expect(
      this.columnDetailPage.calculationTypeDisplay(),
      `calculationType "${expectedCalcTypeLabel}" phải có value="${expectedCalcTypeId}"`
    ).toHaveAttribute('value', expectedCalcTypeId, { timeout: TIMEOUTS.MEDIUM });

    const expectedItems = col.scheme.calculatedItems;
    const expectedCount = expectedItems.length;

    // 2. Assert số lượng tag trong dropdown khớp expected (không thừa/thiếu)
    this.logger.step(`  Assert số lượng tag trong dropdownbox = ${expectedCount}`);
    const allTagsLocator = this.columnDetailPage.calculatedItemTagsAll();
    await expect(
      allTagsLocator,
      `Số lượng tag trong dropdownbox phải đúng ${expectedCount} (không thừa/thiếu)`
    ).toHaveCount(expectedCount, { timeout: TIMEOUTS.MEDIUM });

    // 3. Assert tên từng tag khớp chính xác với subItemTag trong constants
    // Lấy toàn bộ text của các tag đang hiển thị rồi so sánh với expected
    this.logger.step(`  Assert tên các tag = [${expectedItems.join(', ')}]`);
    const actualTexts: string[] = await allTagsLocator.evaluateAll(
      (els: Element[]) => els.map((el) => el.textContent?.trim() ?? '')
    );
    this.logger.info(`  > Tags thực tế: [${actualTexts.join(', ')}]`);

    const sortedActual   = [...actualTexts].sort();
    const sortedExpected = [...expectedItems].sort();
    expect(
      sortedActual,
      `Tên các tag trong dropdownbox phải khớp chính xác: expected [${sortedExpected.join(', ')}], got [${sortedActual.join(', ')}]`
    ).toEqual(sortedExpected);

    // Highlight từng tag tìm được để dễ quan sát trong video
    for (const item of expectedItems) {
      await this.highlightField(this.columnDetailPage.subItemTag(item));
    }

    // 4. columnsToCalculate — textbox number, assert value = scheme.minColumnsCount
    const expectedMinCount = String(col.scheme.minColumnsCount);
    this.logger.step(`  Assert columnsToCalculate = "${expectedMinCount}"`);
    const columnsToCalculateInput = this.columnDetailPage.columnsToCalculateInput();
    await this.highlightField(columnsToCalculateInput);
    await expect(
      columnsToCalculateInput,
      `columnsToCalculate phải có value = "${expectedMinCount}"`
    ).toHaveValue(expectedMinCount, { timeout: TIMEOUTS.MEDIUM });
  }

  /**
   * Assert toàn bộ fields trên trang chi tiết của một cột.
   *
   * Fields được kiểm tra:
   *   - Mã (code)
   *   - Tên (name)
   *   - Hệ số (weight)          — bỏ qua nếu weight === '' (Comment column)
   *   - Loại chấm điểm (gradingType)
   *   - Thuộc học kì (semester) — bỏ qua nếu rỗng (cột không thuộc học kì nào)
   *   - Thuộc nhóm cột điểm (parent) — bỏ qua nếu rỗng (cột không thuộc nhóm nào)
   *   - gradingInput: isReadOnly=true → 1 read-only display "ReadOnly"
   *                   isReadOnly=false → 2 checkbox tương tác (isInputOrImportExcel + isFromTeacherGradebook)
   *   - Thang điểm (gradingMechanism) — bỏ qua nếu rỗng (Comment column)
   *   - Thuộc nhóm cột điểm (parent) — field dạng text display (read-only), không phải input
   *   - Làm tròn (isRound)            — chỉ check khi được define trong constants
   *   - Hiển thị trên báo cáo (isViewOnReport) — idem
   *   - Đồng bộ Canvas (isSyncToCanvas)        — idem
   *   - Scheme tính toán (calculationType + calculatedItems) — chỉ cột Calculation
   */
  async assertColumnDetailSemester(col: ColumnConfig): Promise<void> {
    this.logger.step(`  Assert semester = "${col.semester || 'empty'}"`);
    await this.highlightField(this.columnDetailPage.semesterValue());
    if (col.semester === '') {
      await expect(
        this.columnDetailPage.semesterValue(),
        'semester phải rỗng'
      ).toHaveValue('', { timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(
        this.columnDetailPage.semesterValue(),
        `semester phải là "${col.semester}"`
      ).toHaveValue(col.semester, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnDetailParent(col: ColumnConfig): Promise<void> {
    this.logger.step(`  Assert parent = "${col.parentGroup || 'empty'}"`);
    await this.highlightField(this.columnDetailPage.parentValue());
    if (col.parentGroup === '') {
      await expect(
        this.columnDetailPage.parentValue(),
        'parent phải rỗng'
      ).toHaveValue('', { timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(
        this.columnDetailPage.parentValue(),
        `parent phải là "${col.parentGroup}"`
      ).toHaveValue(col.parentGroup, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnDetailCode(col: ColumnConfig): Promise<void> {
    this.logger.step(`  Assert code = "${col.code}"`);
    await this.highlightField(this.columnDetailPage.codeValue());
    await expect(
      this.columnDetailPage.codeValue(),
      `code phải là "${col.code}"`
    ).toHaveValue(col.code, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnDetailName(col: ColumnConfig): Promise<void> {
    this.logger.step(`  Assert name = "${col.name}"`);
    await this.highlightField(this.columnDetailPage.nameValue());
    await expect(
      this.columnDetailPage.nameValue(),
      `name phải là "${col.name}"`
    ).toHaveValue(col.name, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnDetailReportName(col: ColumnConfig): Promise<void> {
    if (col.reportName !== undefined) {
      this.logger.step(`  Assert reportName = "${col.reportName}"`);
      await this.highlightField(this.columnDetailPage.reportNameValue());
      const actualReportName = await this.columnDetailPage.getReportNameValue();
      expect(actualReportName, `reportName phải là "${col.reportName}"`).toBe(col.reportName);
    } else {
      this.logger.step(`  Skip assert reportName (không có trong test data)`);
    }
  }

  async assertColumnDetailGradingType(col: ColumnConfig): Promise<void> {
    const expectedGradingTypeVal = GRADING_TYPE_VALUE[col.gradingType];
    this.logger.step(`  Assert gradingType = "${col.gradingType}" (value="${expectedGradingTypeVal}")`);
    await this.highlightField(this.columnDetailPage.gradingTypeValue("Grading type:"));
    await expect(
      this.columnDetailPage.gradingTypeValue("Grading type:"),
      `gradingType "${col.gradingType}" phải có attribute value="${expectedGradingTypeVal}"`
    ).toHaveAttribute('value', expectedGradingTypeVal, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertColumnDetailWeight(col: ColumnConfig): Promise<void> {
    if (col.weight !== '') {
      this.logger.step(`  Assert weight = "${col.weight}"`);
      await this.highlightField(this.columnDetailPage.weightValue());
      await expect(
        this.columnDetailPage.weightValue(),
        `weight phải là "${col.weight}"`
      ).toHaveValue(col.weight, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnDetailScheme(col: ColumnConfig): Promise<void> {
    if (col.scheme) {
      await this.assertColumnSubGradingItemDetail(col);
    }
  }

  async assertColumnDetailGradingInput(col: ColumnConfig): Promise<void> {
    if (col.gradingInput.isReadOnly) {
      this.logger.step('  Assert gradingInput = ReadOnly (read-only display)');
      const readOnlyEl = this.columnDetailPage.gradingInputReadOnlyCheckbox();
      await this.highlightField(readOnlyEl);
      await expect(
        readOnlyEl,
        'gradingInput: ReadOnly checkbox phải visible và checked'
      ).toHaveClass(/dx-checkbox-checked/, { timeout: TIMEOUTS.MEDIUM });
    } else if (col.isComment) {
      await this.assertDxCheckbox(
        this.columnDetailPage.isInputOrImportExcelCheckbox(),
        col.gradingInput.isInputOrImportExcel,
        'isInputOrImportExcel'
      );
    } else {
      await this.assertDxCheckbox(
        this.columnDetailPage.isInputOrImportExcelCheckbox(),
        col.gradingInput.isInputOrImportExcel,
        'isInputOrImportExcel'
      );
      await this.assertDxCheckbox(
        this.columnDetailPage.isFromTeacherGradebookCheckbox(),
        col.gradingInput.isFromTeacherGradebook,
        'isFromTeacherGradebook'
      );
    }
  }

  async assertColumnDetailGradingMechanism(col: ColumnConfig): Promise<void> {
    if (col.gradingMechanism !== '') {
      this.logger.step(`  Assert gradingMechanism = "${col.gradingMechanism}"`);
      await this.highlightField(this.columnDetailPage.gradingMechanismValue());
      await expect(
        this.columnDetailPage.gradingMechanismValue(),
        `gradingMechanism phải là "${col.gradingMechanism}"`
      ).toHaveValue(col.gradingMechanism, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnDetailIsRounded(col: ColumnConfig): Promise<void> {
    if (col.isRounded !== undefined) {
      await this.assertDxSwitch(
        this.columnDetailPage.isRoundedCheckbox(),
        col.isRounded,
        'isRounded'
      );
    }
  }

  async assertColumnDetailIsDisplayOnTotalScoreGradeBook(col: ColumnConfig): Promise<void> {
    if (col.isDisplayOnTotalScoreGradeBook !== undefined) {
      await this.assertDxCheckbox(
        this.columnDetailPage.isDisplayOnTotalScoreGradeBookCheckbox(),
        col.isDisplayOnTotalScoreGradeBook,
        'isDisplayOnTotalScoreGradeBook'
      );
    }
  }

  async assertColumnDetailIsSyncToCanvas(col: ColumnConfig): Promise<void> {
    if (col.isSyncToCanvas !== undefined) {
      await this.assertDxCheckbox(
        this.columnDetailPage.isSyncToCanvasCheckbox('Is sync'),
        col.isSyncToCanvas,
        'isSyncToCanvas'
      );
    }
  }

  async assertColumnDetailLineNumber(col: ColumnConfig): Promise<void> {
    this.logger.step(`  Assert lineNumber = "${col.lineNumber === '' ? 'empty' : col.lineNumber}"`);
    const lineNumberInput = this.columnDetailPage.lineNumberInput();
    await this.highlightField(lineNumberInput);
    if (col.lineNumber === '') {
      await expect(async () => {
        const text = (await lineNumberInput.inputValue()).trim();
        expect(text).toBe('');
      }).toPass({ timeout: TIMEOUTS.MEDIUM });
    } else {
      await expect(
        lineNumberInput,
        `lineNumber phải là "${col.lineNumber}"`
      ).toHaveValue(col.lineNumber, { timeout: TIMEOUTS.MEDIUM });
    }
  }

  async assertColumnDetailAllFields(col: ColumnConfig): Promise<void> {
    this.logger.step(`Assert toàn bộ fields chi tiết cột "${col.code}"`);
    await this.assertColumnDetailSemester(col);
    await this.assertColumnDetailParent(col);
    await this.assertColumnDetailCode(col);
    await this.assertColumnDetailName(col);
    await this.assertColumnDetailReportName(col);
    await this.assertColumnDetailGradingType(col);
    await this.assertColumnDetailWeight(col);
    await this.assertColumnDetailScheme(col);
    await this.assertColumnDetailGradingInput(col);
    await this.assertColumnDetailGradingMechanism(col);
    await this.assertColumnDetailIsRounded(col);
    await this.assertColumnDetailIsDisplayOnTotalScoreGradeBook(col);
    await this.assertColumnDetailIsSyncToCanvas(col);
    await this.assertColumnDetailLineNumber(col);
    await this.clearFieldHighlight();
  }

  /**
   * Duyệt qua tất cả cột trong template, mở trang chi tiết từng cột,
   * assert đầy đủ các fields rồi quay lại danh sách.
   *
   * Thay thế cho phiên bản cũ vốn chỉ check cột Calculation qua subGradingItemSchemes.
   * Phiên bản mới đọc toàn bộ config từ col.scheme (embedded) theo constants mới.
   */
  async assertColumnDetailByCode(detail: GradingBookTemplateDetail, colCode: string): Promise<void> {
    const col = detail.columns.find(c => c.code === colCode);
    if (!col) throw new Error(`Column "${colCode}" not found in template "${detail.code}"`);
    this.logger.step(`Assert chi tiết cột "${colCode}" của sổ điểm "${detail.code}"`);
    await this.scrollRowIntoView(col.code);
    await this.openColumnDetail(col.code);
    await expect(this.columnDetailPage.codeValue()).not.toHaveValue('', { timeout: TIMEOUTS.LONG });
    await this.assertColumnDetailAllFields(col);
    await this.closeColumnDetail();
  }

  async assertAllSubGradingItemDetails(detail: GradingBookTemplateDetail): Promise<void> {
    const cols = detail.columns;
    this.logger.step(`Assert chi tiết ${cols.length} cột của sổ điểm "${detail.code}"`);

    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      this.logger.step(`--- [${i + 1}/${cols.length}] Chi tiết cột: ${col.code} ---`);
      await this.scrollRowIntoView(col.code);
      await this.openColumnDetail(col.code);
      await expect(this.columnDetailPage.codeValue()).not.toHaveValue('', { timeout: TIMEOUTS.LONG });
      await this.assertColumnDetailAllFields(col);
      await this.closeColumnDetail();
    }
  }
}
