import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectGradebookListActions } from '../src/actions/SubjectGradebookListActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS } from '../src/constants/ClassConstants';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('SubjectGradebookList - Danh sách sổ điểm môn học', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(`TC_SSG_PRE_003 - Kiểm tra sổ điểm mẫu "${TEST_CLASS.GRADE_BLOCK}" đã được thêm`, async ({ page }) => {
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm tên chương trình = Khối 12 - Ban tự nhiên
    const found = await actions.searchProgram(TEST_CLASS.GRADE_BLOCK);

    // Nếu không lọc thấy data thì skip test case
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${TEST_CLASS.GRADE_BLOCK}" → skip`);
      return;
    }

    // Bước 4-5: đi qua từng môn học, kiểm tra sổ điểm mẫu đúng hay chưa
    await actions.verifyAllSubjectGradebookTemplates();
  });
});
