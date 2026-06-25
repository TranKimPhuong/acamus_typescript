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

## Chạy test

| Lệnh | Mô tả |
|------|-------|
| `npm test` | Chạy toàn bộ test suite |
| `npm run test:login` | Chỉ chạy test login |
| `npm run test:headed` | Chạy với browser hiển thị (headed mode) |
| `npm run test:report` | Mở HTML report sau khi đã chạy xong |
| `npm run lint` | Kiểm tra TypeScript type errors |

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