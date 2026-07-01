# CLAUDE.md — Project Instructions

## Project overview
<!-- Mô tả ngắn về project: test automation cho hệ thống nào, công nghệ gì -->
Test automation cho project SIS về Education

## Tech stack
- Playwright + TypeScript
- DevExtreme UI components
- Angular frontend

## Folder structure
<!-- Mô tả các folder quan trọng nếu cần -->
- `src/pages/` — Page Object Model
- `src/actions/` — Action classes (business logic)
- `src/constants/` — Test data & constants
- `tests/` — Test files

---

## Locator conventions
<!-- Ghi lại các rule về selector để tránh lỗi lặp lại -->

- Luôn scope locator vào đúng component/popup, không dùng selector quá chung chung
- locator lấy theo Css, hạn chế lấy theo query.... Khi nào ko dùng css đc thì dùng Jquery 
- Locator đảm bào là duy nhất
- Ưu tiên lấy locator:
  - cấp 1: thẻ chính với name, id, ...
  - cấp 2: lấy theo quan hệ anh chị Education
  - cấp 3: lấy theo cha, ông ...

## Coding conventions
<!-- Các quy tắc code bạn muốn Claude tuân theo -->

- Không thêm comment giải thích WHAT, chỉ comment khi WHY không rõ ràng
- Không tạo abstraction hoặc refactor khi task không yêu cầu
- Xóa hết tất cả locator, method ko có reference
- Cần xem lại style của hàm đang có để viết theo
- cần review lại code để chugn style viết

## Fix approach
<!-- Cách tiếp cận khi fix bug/test -->

- Fix từng lỗi một theo kết quả test thực tế, không anticipate lỗi chưa xảy ra
- Không fix hàng loạt nhiều file cùng lúc trừ khi được yêu cầu rõ ràng
- Fix dúng chổ đang lỗi locator hoặc commanline trong code, ko fix chổ ko bị lỗi
---

## Domain knowledge
<!-- Các khái niệm nghiệp vụ quan trọng để Claude hiểu context -->
- học sinh
- trường học: phòng , lớp Chủ nhiệm, Lớp bộ môn
- Giáo viên
- PH học sinh
- Sổ điểm theo từng môn
- Sổ điểm tổng kết: cuối nằm KQHT, KQLL, khen thưởng, Thi lại, ....
- Sổ đầu bài: đánh giá tiết học, và sỗ đầu bài theo lớp
- Chuyên cần: điểm danh báo cáo, xin nghỉ phép
- Hồ sơ y tế, khám định kì, khám bất thường
- TIn tức lớp, trường, sự kiện, thực đơn
- Khảo sát cho PH
- Đồng bộ với canvas LMS: caourse, HS, PH, GV, bài tập, điểm
- Xuất data cho VnEdu
- Phân quyền hệ thống, campus
- báo cáo học tập
- Kết chuyển lớp, học sinh
- Kỷ luật khen thường, đồi quà, thi đua lớp
- dồng bộ sang parent portal
- Quản trị
- mobile app cho PH: xem thông tin HS, điểm danh, khen thưởng kỷ luật, tin tức, y tế, bài tập

## Known issues / workarounds
<!-- Các bug đã biết hoặc workaround đang dùng tạm -->

<!--
Ví dụ:
- DevExtreme virtual scroll cần dùng DevExpress API thay vì set scrollTop trực tiếp
- ...
-->
