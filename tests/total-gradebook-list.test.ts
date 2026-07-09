import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { TotalGradebookListActions } from '../src/actions/TotalGradebookListActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { GRADE_LEVELS, TOTAL_GRADEBOOK_TEMPLATE } from '../src/constants/TotalGradebookListConstants';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('TotalGradebookList - Danh sách sổ điểm tổng kết', { tag: '@total-gradebook-list' }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(`TC_TGL_01 - Kiểm tra "${GRADE_LEVELS.KHOI_12}" đã được cấu hình sổ điểm tổng kết`, { tag: ['@thcs'] }, async ({ page }) => {
    test.setTimeout(120000);
    await loginAndSelectContext(page);

    const actions = new TotalGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Total gradebook (new)
    await actions.nav.navigateToTotalGradebookViewsList();

    // Bước 3: tìm và lọc theo Khối 12
    await actions.filterByGrade(GRADE_LEVELS.KHOI_12);

    // Bước 4: kiểm tra cột "Total gradebook templates" đã có item chưa
    const hasTemplate = await actions.hasGradebookTemplate(GRADE_LEVELS.KHOI_12);
    if (hasTemplate) {
      // Đã có → xóa đi (popup tự mở lại để chọn sổ điểm mới)
      await actions.deleteGradebookTemplate(GRADE_LEVELS.KHOI_12);
    } else {
      // Chưa có → thêm mới
      await actions.clickAddIcon(GRADE_LEVELS.KHOI_12);
    }

    await actions.selectGradebookTemplateInDialog(TOTAL_GRADEBOOK_TEMPLATE.THCS_THPT);
    await actions.saveGradebookDialog();

    // Bước 5: kiểm tra cột "Total gradebook templates" đã có item lại => thêm mới thành công
    await actions.verifyGradebookTemplate(GRADE_LEVELS.KHOI_12, TOTAL_GRADEBOOK_TEMPLATE.THCS_THPT);
  });
});
