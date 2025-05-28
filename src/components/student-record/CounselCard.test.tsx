import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CounselCard from "./CounselCard";

const defaultProps = {
  id: 1,
  dateTime: "2024-05-26T14:30:00",
  category: "상담 주제",
  teacher: "홍길동",
  content: "상담 내용입니다.",
  nextPlan: "향후 계획입니다.",
  isPublic: true,
};

test("내용은 기본적으로 닫혀있고, 클릭하면 내용이 열린다", async () => {
  render(<CounselCard {...defaultProps} />);

  // 기본적으로 내용은 화면에 없음
  expect(screen.queryByText("상담 내용입니다.")).toBeNull();

  // 헤더 클릭 (날짜 텍스트 클릭)
  fireEvent.click(screen.getByText(/2024년 5월 26일 14:30/));

  // 애니메이션 끝나고 내용 보임을 기다림
  await waitFor(() => {
    expect(screen.getByText("상담 내용입니다.")).toBeVisible();
  });

  // 다시 클릭하면 닫힘
  fireEvent.click(screen.getByText(/2024년 5월 26일 14:30/));

  // 닫힌 후 내용이 화면에서 사라졌는지 확인
  await waitFor(() => {
    expect(screen.queryByText("상담 내용입니다.")).toBeNull();
  });
});
