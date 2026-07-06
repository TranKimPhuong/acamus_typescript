export interface GradingBookTemplate {
  code: string;
  name: string;
}

export const SYSTEM_GRADING_BOOK_TEMPLATES: GradingBookTemplate[] = [
  {
    code: 'TH_MOET_DGDK_MUCDATDUOC',
    name: 'Sổ điểm MOET - Tiểu học - Đánh giá định kỳ & Mức đạt được',
  },
  {
    code: 'TH_MOET_MUCDATDUOC',
    name: 'Sổ điểm MOET - Tiểu học - Đánh giá theo mức đạt được',
  },
  {
    code: 'THCS_THPT_MOET_DGBD',
    name: 'Sổ điểm MOET - Trung học - Đánh giá bằng điểm',
  },
  {
    code: 'THCS_THPT_MOET_DGNX',
    name: 'Sổ điểm MOET - Trung học - Đánh giá nhận xét',
  },
];
