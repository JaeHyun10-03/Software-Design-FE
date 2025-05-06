export const COUNSEL_TYPES = ["대학", "취업", "가정", "학업", "개인", "기타"];

export const categoryMap: Record<string, string> = {
  UNIVERSITY: "대학",
  CAREER: "취업",
  FAMILY: "가정",
  ACADEMIC: "학업",
  PERSONAL: "개인",
  OTHER: "기타",
};

export const reverseCategoryMap: Record<string, string> = Object.fromEntries(
  Object.entries(categoryMap).map(([en, ko]) => [ko, en])
);
