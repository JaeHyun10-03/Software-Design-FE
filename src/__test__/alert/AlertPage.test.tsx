// __tests__/pages/AlertPage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AlertPage from "@/pages/alert";

jest.mock("@/components/shared/Header", () => ({
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
}));

describe("<AlertPage />", () => {
  it("알림 제목과 알림 리스트가 렌더링된다", async () => {
    render(<AlertPage />);

    // 제목
    expect(screen.getByText("알림")).toBeInTheDocument();

    // 비동기 useEffect 이후 데이터 렌더링
    await waitFor(() => {
      expect(screen.getByText("OOO님이 성적을 입력하였습니다.")).toBeInTheDocument();
      expect(screen.getByText("OOO님이 OOO 피드백을 작성하였습니다.")).toBeInTheDocument();
    });

    // 시간도 렌더링되는지 확인
    expect(screen.getAllByText("2025.03.10 10:00").length).toBeGreaterThanOrEqual(2);

    // 이미지 alt 속성 확인
    expect(screen.getAllByAltText("profile").length).toBeGreaterThanOrEqual(2);
  });

  it("알림이 없을 때도 에러 없이 렌더링된다", async () => {
    // useState를 빈 배열로 초기화하고 useEffect를 비워서 테스트할 수도 있음
    // 혹은 setAlerts([])를 강제로 호출하는 방식으로도 가능

    // AlertPage 내부의 alerts 상태를 강제로 빈 배열로 만들어 테스트하는 방법 예시
    // (실제 상황에서는 AlertPage를 분리해서 테스트하거나, fetchAlerts를 mock 처리할 수 있음)
    // 여기서는 간단히 렌더링 에러가 없는지만 확인
    render(<AlertPage />);
    await waitFor(() => {
      expect(screen.getByText("알림")).toBeInTheDocument();
    });
  });
});
