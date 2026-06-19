import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { ClassActions } from '../src/actions/ClassActions';
import { ClassDetailActions } from '../src/actions/ClassDetailActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';

const LOGIN_HOST_URL = 'https://sis-qc-host.sis.flexiapp.cloud/';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('Class - Danh sách lớp học', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_HOST_URL);
  });

  test('TC_001 - Kiểm tra lớp 12A1_auto tồn tại trong danh sách lớp học', async ({ page }) => {
    await loginAndSelectContext(page);
    const actions = new ClassActions(page);
    await actions.nav.navigateToClassList();
    await actions.assertClassRecordExists('12A1', '12A1_auto');
  });

  test('TC__002 - Kiểm tra lớp 12A1_auto có ít nhất 1 học sinh', async ({ page }) => {
    await loginAndSelectContext(page);
    const classActions = new ClassActions(page);
    const detailActions = new ClassDetailActions(page);
    await classActions.nav.navigateToClassList();
    await classActions.openClassDetail('12A1_auto');
    await detailActions.assertClassHasStudents();
  });
});
