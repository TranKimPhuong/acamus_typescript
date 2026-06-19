import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectGradingBookListActions } from '../src/actions/SubjectGradingBookListActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS } from '../src/constants/ClassConstants';

const LOGIN_HOST_URL = 'https://sis-qc-host.sis.flexiapp.cloud/';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('SubjectGradebookList - Danh sách sổ điểm môn học', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_HOST_URL);
  });

  test(`TC_SSG_PRE_003 - Kiểm tra sổ điểm mẫu "${TEST_CLASS.GRADE_BLOCK}" đã được thêm`, async ({ page }) => {
    await loginAndSelectContext(page);
    const actions = new SubjectGradingBookListActions(page);
    await actions.assertGradingBookViewsOrSkip();
  });
});
