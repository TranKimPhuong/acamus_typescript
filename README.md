# Acamus Playwright TypeScript

Automation test framework cho hệ thống **Acamus SIS** (Student Information System), sử dụng Playwright + TypeScript theo kiến trúc **Page Object Model (POM)**.

## Yêu cầu môi trường

- Node.js >= 18
- npm >= 9

## Cài đặt

```bash
npm install
npx playwright install chromium
```

## MCP server (hỗ trợ lấy locator)

Project có cấu hình sẵn **Playwright MCP server** trong `.mcp.json` để Claude Code có thể mở trình duyệt thật, load trang test và đọc DOM/accessibility snapshot — giúp lấy locator chính xác theo convention thay vì đoán từ source code tĩnh.

- Lần đầu mở Claude Code trong project, sẽ có prompt yêu cầu **trust** MCP server này — cần approve mới dùng được.
- Không cần cài đặt thêm gì, server được chạy qua `npx @playwright/mcp@latest` tự động.

## Chạy test

| Lệnh | Mô tả |
|------|-------|
| `npm test` | Chạy toàn bộ test suite |
| `npm run test:login` | Chỉ chạy test login |
| `npm run test:headed` | Chạy với browser hiển thị (headed mode) |
| `npm run test:report` | Mở HTML report sau khi đã chạy xong |
| `npm run lint` | Kiểm tra TypeScript type errors |

## Bật/tắt test case theo tag

Mỗi `test()`/`test.describe()` được gắn tag (vd `@login`, `@th`, `@thcs`, `@number`, `@letter`) để chọn chạy đúng nhóm test mong muốn mà không cần sửa file:

> ⚠️ Luôn để tag trong dấu ngoặc kép `"..."`. Trên PowerShell, viết `@login` không có dấu ngoặc sẽ bị hiểu là toán tử **splat** (`@tênBiến`) thay vì chuỗi literal — do biến không tồn tại, PowerShell sẽ splat ra rỗng khiến `--grep` báo thiếu tham số.

```bash
# Chạy 1 tag
npx playwright test --grep "@login"

# Chạy nhiều tag (OR) — test khớp 1 trong các tag
npx playwright test --grep "@th|@thcs"

# Chạy giao của nhiều tag (AND) — test phải có cả 2 tag
npx playwright test --grep "(?=.*@formula-check)(?=.*@letter)"

# Bỏ qua 1 tag
npx playwright test --grep-invert "@score-by-course"

# Dùng script có sẵn (đưa tag vào sau --)
npm run test:tag -- "@formula-check"
npm run test:tag:skip -- "@score-by-course"
```

Danh sách tag hiện có:

| Tag | Ý nghĩa |
|-----|---------|
| `@login` | Test login |
| `@class` | Test danh sách lớp học |
| `@gradebook-template` | Test sổ điểm mẫu |
| `@gradebook-list` | Test danh sách sổ điểm môn học |
| `@score-by-course` | Test nhập điểm theo từng course |
| `@th` / `@thcs` | Nhập điểm cho lớp thuộc Bậc Tiểu học / THCS-THPT |
| `@formula-check` | Test kiểm tra công thức tính HK1/HK2/CN |
| `@number` / `@letter` | Môn tính điểm số / điểm chữ |
| `@add-template` | Test thêm mới sổ điểm mẫu cho môn học |
| `@detail-check` | Test kiểm tra chi tiết cột của sổ điểm mẫu |

Khi thêm test mới, gắn tag qua tham số thứ 2 của `test()`/`test.describe()`:

```ts
test('TC_XXX - ...', { tag: ['@module', '@th'] }, async ({ page }) => { ... });
```

## Môi trường test

| Môi trường | URL |
|------------|-----|
| QC (app) | https://sis-qc.sis.flexiapp.cloud |
| QC (host login) | https://sis-qc-host.sis.flexiapp.cloud |

> Base URL được cấu hình trong `playwright.config.ts`. Mỗi test file có thể override URL riêng nếu cần.

## Cấu trúc thư mục

```
acamus_typescript/
├── src/
│   ├── actions/        # Business logic — orchestrate nhiều bước thành một action
│   ├── constants/      # Locators và test data constants
│   ├── data/           # Test data (credentials, input values)
│   ├── libs/           # Base classes và utilities (BasePage, Logger)
│   └── pages/          # Page Objects — ánh xạ UI elements của từng trang
├── tests/              # Test files (*.test.ts)
├── reports/
│   ├── html/           # HTML report (mở bằng npm run test:report)
│   ├── junit/          # JUnit XML report (dùng cho CI/CD)
│   └── test-results/   # Screenshots, videos, traces khi test fail
└── playwright.config.ts
```

### Luồng phân lớp (POM layers)

```
Test file → Actions → Pages → BasePage
                ↓
           Constants (locators)
                ↓
             Data (test data)
```

- **Pages**: chỉ khai báo locators và các thao tác UI đơn lẻ
- **Actions**: gom nhiều bước lại thành một hành động nghiệp vụ có ý nghĩa
- **Constants**: tập trung locators và giá trị cố định, dễ bảo trì khi UI thay đổi

## Reports

Sau khi chạy test, reports được sinh tự động tại thư mục `reports/`:

- **HTML report**: `npm run test:report`
- **JUnit XML**: `reports/junit/results.xml` — dùng để tích hợp CI/CD
- **Artifacts khi fail**: screenshot, video, trace lưu trong `reports/test-results/`

## Cấu hình Playwright

Xem file `playwright.config.ts` để biết các thông số:
- `timeout`: 60s mỗi test
- `workers`: 1 (chạy tuần tự, không song song)
- `headless`: false (browser hiển thị khi chạy local)
- `retries`: 1 lần retry khi chạy trên CI