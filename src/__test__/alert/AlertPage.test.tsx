import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AlertPage from "@/pages/alert";
import * as getNotificationsApi from "@/api/student/getNotifications";

// GetNotification mock
jest.mock("@/api/student/getNotifications");

describe("<AlertPage />", () => {
  beforeAll(() => {
    // MockHeader를 describe 안에서 선언
    const MockHeader = ({ children }: any) => <div data-testid="header">{children}</div>;
    MockHeader.displayName = "MockHeader";
    jest.mock("@/components/shared/StudentHeader", () => ({
      __esModule: true,
      Header: MockHeader,
    }));
  });

  // IntersectionObserver mock (테스트 환경용)
beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
   // @ts-expect-error: testing invalid alert props
  window.IntersectionObserver = MockIntersectionObserver;
});


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("알림 제목과 알림 리스트가 렌더링된다", async () => {
    (getNotificationsApi.GetNotification as jest.Mock).mockResolvedValueOnce({
      notifications: [
        {
          time: "2025.03.10 10:00",
          message: "OOO님이 성적을 입력하였습니다.",
          image: "images/defaultImage.png",
        },
        {
          time: "2025.03.10 10:00",
          message: "OOO님이 OOO 피드백을 작성하였습니다.",
          image: "images/defaultImage.png",
        },
      ],
    });

    render(<AlertPage />);

    expect(screen.getByText("알림")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("OOO님이 성적을 입력하였습니다.")).toBeInTheDocument();
      expect(screen.getByText("OOO님이 OOO 피드백을 작성하였습니다.")).toBeInTheDocument();
    });

    expect(screen.getAllByText("2025.03.10 10:00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByAltText("profile").length).toBeGreaterThanOrEqual(2);
  });

  it("알림이 없을 때도 에러 없이 렌더링된다", async () => {
    (getNotificationsApi.GetNotification as jest.Mock).mockResolvedValueOnce({
      notifications: [],
    });

    render(<AlertPage />);
    await waitFor(() => {
      expect(screen.getByText("알림")).toBeInTheDocument();
      expect(screen.queryByText("OOO님이 성적을 입력하였습니다.")).not.toBeInTheDocument();
    });
  });
});
