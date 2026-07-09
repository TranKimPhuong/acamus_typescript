import { test } from '@playwright/test';
import { LoginActions } from '../src/actions/LoginActions';
import { TopBarActions } from '../src/actions/TopBarActions';
import { SubjectGradebookListActions } from '../src/actions/SubjectGradebookListActions';
import { SubjectGradebookTemplateDetailActions } from '../src/actions/SubjectGradebookTemplateDetailActions';
import { VALID_USER } from '../src/data/LoginData';
import { CAMPUS, SCHOOL_YEAR } from '../src/constants/TopBarConstants';
import { TEST_CLASS_THCS } from '../src/data/ClassData';
import { GRADEBOOK_TEMPLATE, PROGRAMS, SUBJECTS } from '../src/constants/SubjectGradebookListConstants';
import {
  THCS_THPT_MOET_DGBD_DETAIL,
  THCS_THPT_MOET_DGNX_DETAIL,
  TH_MOET_DGDK_MUCDATDUOC_DETAIL,
  TH_MOET_MUCDATDUOC_DETAIL,
} from '../src/constants/SubjectGradebookTemplateDetailConstants';

async function loginAndSelectContext(page: any) {
  const loginActions = new LoginActions(page);
  const topBarActions = new TopBarActions(page);
  await loginActions.loginAndWaitForDashboard(VALID_USER.username, VALID_USER.password);
  await topBarActions.selectCampusAndSchoolYear(CAMPUS.NAME, SCHOOL_YEAR.NAME);
}

test.describe('SubjectGradebookList - Danh sách sổ điểm môn học', { tag: '@gradebook-list' }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test(`TC_SSG_01 - Kiểm tra chương trình "${TEST_CLASS_THCS.LEARNING_PROGRAM}" đã thêm sổ điểm mẫu cho các course`, { tag: ['@thcs'] }, async ({ page }) => {
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm tên chương trình = Khối 12 - Ban tự nhiên
    const found = await actions.searchProgram(TEST_CLASS_THCS.LEARNING_PROGRAM);

    // Nếu không lọc thấy data thì skip test case
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${TEST_CLASS_THCS.LEARNING_PROGRAM}" → skip`);
      return;
    }

    // Bước 4-5: đi qua từng môn học, kiểm tra sổ điểm mẫu cho từng môn đúng hay chưa
    await actions.verifyAllSubjectGradebookTemplates();
  });

  test(`TC_SSG_02 - Kiểm tra thêm mới sổ điểm mẫu cho môn "${SUBJECTS.TOAN}" - chương trình "${PROGRAMS.THCS_KHOI_7}"`, { tag: ['@thcs', '@add-template'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET THCS - Khối 7
    const found = await actions.searchProgram(PROGRAMS.THCS_KHOI_7);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.THCS_KHOI_7}" → skip`);
      return;
    }

    // Bước 3: môn Toán chưa có sổ điểm mẫu → click nút tạo mới; đã có → xóa (popup tự mở lại)
    const hasTemplate = await actions.hasGradebookTemplate(SUBJECTS.TOAN);
    if (hasTemplate) {
      await actions.deleteGradebookTemplate(SUBJECTS.TOAN);
    } else {
      await actions.clickAddIcon(SUBJECTS.TOAN);
    }

    // Bước 4: chọn sổ điểm = 'Sổ điểm MOET - Trung học - Đánh giá bằng điểm'
    await actions.selectGradebookTemplateInDialog(GRADEBOOK_TEMPLATE.SCORE_THCS);

    // Bước 5: nhấn Lưu
    await actions.saveGradebookDialog();

    // Kiểm tra sổ điểm mẫu đã thêm thành công cho môn Toán
    await actions.verifySubjectGradebookTemplate(SUBJECTS.TOAN, GRADEBOOK_TEMPLATE.SCORE_THCS);
  });

  test(`TC_SSG_03 - Kiểm tra chi tiết sổ điểm mẫu đã thêm cho môn "${SUBJECTS.TOAN}" - chương trình "${PROGRAMS.THCS_KHOI_7}"`, { tag: ['@thcs', '@detail-check'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);
    const detailActions = new SubjectGradebookTemplateDetailActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET THCS - Khối 7
    const found = await actions.searchProgram(PROGRAMS.THCS_KHOI_7);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.THCS_KHOI_7}" → skip`);
      return;
    }

    // Bước 4: tìm môn Toán, kiểm tra đã có sổ điểm mẫu được thêm
    await actions.verifySubjectGradebookTemplate(SUBJECTS.TOAN, GRADEBOOK_TEMPLATE.SCORE_THCS);

    // Bước 6: click nút edit, kiểm tra số cột, tên cột, mã cột, weight, gradingscheme, semester, grading type, Linenumber
    await actions.openGradebookDetail(SUBJECTS.TOAN);
    await detailActions.assertFullDetail(THCS_THPT_MOET_DGBD_DETAIL);

    // Bước 7: kiểm tra isSync của từng cột (chỉ có ở trang chi tiết cột)
    // Navigate từ Danh sách sổ điểm mẫu môn học (navigateToGradingBookViewsList) → không có field reportName → skip
    await detailActions.assertAllSubGradingItemDetails(THCS_THPT_MOET_DGBD_DETAIL, true);
  });

  test(`TC_SSG_04 - Kiểm tra thêm mới sổ điểm mẫu cho môn "${SUBJECTS.GIAO_DUC_CONG_DAN}" - chương trình "${PROGRAMS.THCS_KHOI_7}"`, { tag: ['@thcs', '@add-template'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET THCS - Khối 7
    const found = await actions.searchProgram(PROGRAMS.THCS_KHOI_7);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.THCS_KHOI_7}" → skip`);
      return;
    }

    // Bước 3: môn Toán chưa có sổ điểm mẫu → click nút tạo mới; đã có → xóa (popup tự mở lại)
    const hasTemplate = await actions.hasGradebookTemplate(SUBJECTS.GIAO_DUC_CONG_DAN);
    if (hasTemplate) {
      await actions.deleteGradebookTemplate(SUBJECTS.GIAO_DUC_CONG_DAN);
    } else {
      await actions.clickAddIcon(SUBJECTS.GIAO_DUC_CONG_DAN);
    }

    // Bước 4: chọn sổ điểm = 'Sổ điểm MOET - Trung học - Đánh giá bằng nhận xét'
    await actions.selectGradebookTemplateInDialog(GRADEBOOK_TEMPLATE.COMMENT_THCS);

    // Bước 5: nhấn Lưu
    await actions.saveGradebookDialog();

    // Kiểm tra sổ điểm mẫu đã thêm thành công cho môn Giáo dục công dân
    await actions.verifySubjectGradebookTemplate(SUBJECTS.GIAO_DUC_CONG_DAN, GRADEBOOK_TEMPLATE.COMMENT_THCS);
  });


  test(`TC_SSG_05 - Kiểm tra chi tiết sổ điểm mẫu đã thêm cho môn "${SUBJECTS.GIAO_DUC_CONG_DAN}" - chương trình "${PROGRAMS.THCS_KHOI_7}"`, { tag: ['@thcs', '@detail-check'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);
    const detailActions = new SubjectGradebookTemplateDetailActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET THCS - Khối 7
    const found = await actions.searchProgram(PROGRAMS.THCS_KHOI_7);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.THCS_KHOI_7}" → skip`);
      return;
    }

    // Bước 4: tìm môn Giáo dục công dân, kiểm tra đã có sổ điểm mẫu được thêm
    await actions.verifySubjectGradebookTemplate(SUBJECTS.GIAO_DUC_CONG_DAN, GRADEBOOK_TEMPLATE.COMMENT_THCS);

    // Bước 6: click nút edit, kiểm tra số cột, tên cột, mã cột, weight, gradingscheme, semester, grading type, Linenumber
    await actions.openGradebookDetail(SUBJECTS.GIAO_DUC_CONG_DAN);
    await detailActions.assertFullDetail(THCS_THPT_MOET_DGNX_DETAIL);

    // Bước 7: kiểm tra isSync của từng cột (chỉ có ở trang chi tiết cột)
    // Navigate từ Danh sách sổ điểm mẫu môn học (navigateToGradingBookViewsList) → không có field reportName → skip
    await detailActions.assertAllSubGradingItemDetails(THCS_THPT_MOET_DGNX_DETAIL, true);
  });

  test(`TC_SSG_06 - Kiểm tra thêm mới sổ điểm mẫu cho môn "${SUBJECTS.TOAN}" - chương trình "${PROGRAMS.TH_KHOI_5}"`, { tag: ['@th', '@add-template'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET Tiểu học - Khối 5
    const found = await actions.searchProgram(PROGRAMS.TH_KHOI_5);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.TH_KHOI_5}" → skip`);
      return;
    }

    // Bước 3: môn Toán chưa có sổ điểm mẫu → click nút tạo mới; đã có → xóa (popup tự mở lại)
    const hasTemplate = await actions.hasGradebookTemplate(SUBJECTS.TOAN);
    if (hasTemplate) {
      await actions.deleteGradebookTemplate(SUBJECTS.TOAN);
    } else {
      await actions.clickAddIcon(SUBJECTS.TOAN);
    }

    // Bước 4: chọn sổ điểm = 'Sổ điểm MOET - Tiểu học - Đánh giá định kỳ & Mức đạt được'
    await actions.selectGradebookTemplateInDialog(GRADEBOOK_TEMPLATE.DGDK_MUCDATDUOC_TIEU_HOC);

    // Bước 5: nhấn Lưu
    await actions.saveGradebookDialog();

    // Kiểm tra sổ điểm mẫu đã thêm thành công cho môn Toán
    await actions.verifySubjectGradebookTemplate(SUBJECTS.TOAN, GRADEBOOK_TEMPLATE.DGDK_MUCDATDUOC_TIEU_HOC);
  });

  test(`TC_SSG_07 - Kiểm tra chi tiết sổ điểm mẫu đã thêm cho môn "${SUBJECTS.TOAN}" - chương trình "${PROGRAMS.TH_KHOI_5}"`, { tag: ['@th', '@detail-check'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);
    const detailActions = new SubjectGradebookTemplateDetailActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET Tiểu học - Khối 5
    const found = await actions.searchProgram(PROGRAMS.TH_KHOI_5);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.TH_KHOI_5}" → skip`);
      return;
    }

    // Bước 4: tìm môn Toán, kiểm tra đã có sổ điểm mẫu được thêm
    await actions.verifySubjectGradebookTemplate(SUBJECTS.TOAN, GRADEBOOK_TEMPLATE.DGDK_MUCDATDUOC_TIEU_HOC);

    // Bước 6: click nút edit, kiểm tra số cột, tên cột, mã cột, weight, gradingscheme, semester, grading type, Linenumber
    await actions.openGradebookDetail(SUBJECTS.TOAN);
    await detailActions.assertFullDetail(TH_MOET_DGDK_MUCDATDUOC_DETAIL);

    // Bước 7: kiểm tra isSync của từng cột (chỉ có ở trang chi tiết cột)
    // Navigate từ Danh sách sổ điểm mẫu môn học (navigateToGradingBookViewsList) → không có field reportName → skip
    await detailActions.assertAllSubGradingItemDetails(TH_MOET_DGDK_MUCDATDUOC_DETAIL, true);
  });

  test(`TC_SSG_08 - Kiểm tra thêm mới sổ điểm mẫu cho môn "${SUBJECTS.AM_NHAC}" - chương trình "${PROGRAMS.TH_KHOI_5}"`, { tag: ['@th', '@add-template'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET Tiểu học - Khối 5
    const found = await actions.searchProgram(PROGRAMS.TH_KHOI_5);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.TH_KHOI_5}" → skip`);
      return;
    }

    // Bước 3: môn Âm nhạc chưa có sổ điểm mẫu → click nút tạo mới; đã có → xóa (popup tự mở lại)
    const hasTemplate = await actions.hasGradebookTemplate(SUBJECTS.AM_NHAC);
    if (hasTemplate) {
      await actions.deleteGradebookTemplate(SUBJECTS.AM_NHAC);
    } else {
      await actions.clickAddIcon(SUBJECTS.AM_NHAC);
    }

    // Bước 4: chọn sổ điểm = 'Sổ điểm MOET - Tiểu học - Đánh giá theo mức đạt được'
    await actions.selectGradebookTemplateInDialog(GRADEBOOK_TEMPLATE.MUCDATDUOC_TIEU_HOC);

    // Bước 5: nhấn Lưu
    await actions.saveGradebookDialog();

    // Kiểm tra sổ điểm mẫu đã thêm thành công cho môn Âm nhạc
    await actions.verifySubjectGradebookTemplate(SUBJECTS.AM_NHAC, GRADEBOOK_TEMPLATE.MUCDATDUOC_TIEU_HOC);
  });

  test(`TC_SSG_09 - Kiểm tra chi tiết sổ điểm mẫu đã thêm cho môn "${SUBJECTS.AM_NHAC}" - chương trình "${PROGRAMS.TH_KHOI_5}"`, { tag: ['@th', '@detail-check'] }, async ({ page }) => {
    test.setTimeout(300000); // nhiều cột × nhiều assertions
    await loginAndSelectContext(page);

    const actions = new SubjectGradebookListActions(page);
    const detailActions = new SubjectGradebookTemplateDetailActions(page);

    // Bước 2: đi đến menu Sổ điểm -> Thiết lập sổ điểm mẫu -> Danh sách sổ điểm mẫu
    await actions.navigateToGradingBookViewsList();

    // Bước 3: tìm chương trình MOET Tiểu học - Khối 5
    const found = await actions.searchProgram(PROGRAMS.TH_KHOI_5);
    if (!found) {
      test.skip(true, `Không tìm thấy chương trình "${PROGRAMS.TH_KHOI_5}" → skip`);
      return;
    }

    // Bước 4: tìm môn Âm nhạc, kiểm tra đã có sổ điểm mẫu được thêm
    await actions.verifySubjectGradebookTemplate(SUBJECTS.AM_NHAC, GRADEBOOK_TEMPLATE.MUCDATDUOC_TIEU_HOC);

    // Bước 6: click nút edit, kiểm tra số cột, tên cột, mã cột, weight, gradingscheme, semester, grading type, Linenumber
    await actions.openGradebookDetail(SUBJECTS.AM_NHAC);
    await detailActions.assertFullDetail(TH_MOET_MUCDATDUOC_DETAIL);

    // Bước 7: kiểm tra isSync của từng cột (chỉ có ở trang chi tiết cột)
    // Navigate từ Danh sách sổ điểm mẫu môn học (navigateToGradingBookViewsList) → không có field reportName → skip
    await detailActions.assertAllSubGradingItemDetails(TH_MOET_MUCDATDUOC_DETAIL, true);
  });
});
