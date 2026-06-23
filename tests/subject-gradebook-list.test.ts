import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectGradingBookListActions } from '../src/actions/SubjectGradingBookListActions';
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
    // đi đến menu Sổ điểm -> thiết lap sổ điểm mẫu -> danh sách sổ điểm mẫu
    // tìm tên chương trình = Khối 12 - Ban tự nhiên
    // kiểm tra lọc thấy data, nếu không thấy thì skip test case
    // đi qua từng môn học, kiểm tra xem có sổ điểm mẫu hay không, nếu chưa tạo thì dừng test case,
    // nếu đã tạo thì kiểm tra xem có đúng sổ điểm mẫu hay không: cột Sổ điểm mẩu môn học = 	Sổ điểm MOET - Trung học - Đánh giá bằng điểm
    // ds sách các môn học chấm bằng điểm : Toán, Tiếng Anh, Tin học, Vật lí, Hóa học, Sinh học, Công nghệ, Lịch sử, Ngữ văn, KHTN/Lí, KHTN/Hóa, KHTN/Sinh học, 
    // ds các môn học chấm bằng nhận xét_Sổ điểm MOET - Trung học - Đánh giá nhận xét : Giáo dục thể chất, Hoạt động trải nghiệm, Giáo dục địa phương, Giáo dục QPAN, Giáo dục công dân
    // ds môn học ko có gán sổ điểm : Sinh hoạt chủ nhiệm
    const actions = new SubjectGradingBookListActions(page);
    await actions.assertGradingBookViewsOrSkip();
  });
});
