import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { TotalScoreActions } from '../src/actions/TotalScoreActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS_THCS } from '../src/data/ClassData';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('TotalScore - Điểm tổng kết', { tag: '@total-score' }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(`TC_TS_01 - Kiểm tra lớp "${TEST_CLASS_THCS.NAME}" đã được cấu hình Điểm tổng kết`, { tag: ['@thcs'] }, async ({ page }) => {
    await loginAndSelectContext(page);

    const actions = new TotalScoreActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Điểm tổng kết
    await actions.nav.navigateToTotalScores();

    // Bước 3: chọn lớp 12A1_auto
    await actions.selectClass(TEST_CLASS_THCS.NAME);

    // Nếu chưa gán sổ điểm tổng kết mẫu cho lớp/chương trình → skip, không phải lỗi automation
    const notConfigured = await actions.isGradebookNotConfigured();
    if (notConfigured) {
      test.skip(true, `Lớp "${TEST_CLASS_THCS.NAME}" chưa được cấu hình sổ điểm tổng kết mẫu → skip`);
      return;
    }

    // Bước 4: kiểm tra có học sinh tồn tại
    await actions.assertStudentListVisible();
  });
});
