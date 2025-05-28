import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FeedbackModal from "./FeedbackModal";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("FeedbackModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    localStorage.setItem("accessToken", "test-token");
    mockOnClose.mockClear();
  });

  it("renders fetched feedback", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "정말 잘했어요!" } },
    });

    render(<FeedbackModal name="홍길동" onClose={mockOnClose} scoreSummaryId={1} />);

    await waitFor(() => {
      expect(screen.getByText("정말 잘했어요!")).toBeInTheDocument();
    });
  });

  it('renders "피드백이 없습니다." when feedback is null', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: null } },
    });

    render(<FeedbackModal name="홍길동" onClose={mockOnClose} scoreSummaryId={2} />);

    await waitFor(() => {
      expect(screen.getByText("피드백이 없습니다.")).toBeInTheDocument();
    });
  });

  it("calls onClose when backdrop is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "백드롭 클릭 테스트" } },
    });

    const { container } = render(<FeedbackModal name="홍길동" onClose={mockOnClose} scoreSummaryId={3} />);

    await waitFor(() => {
      expect(screen.getByText("백드롭 클릭 테스트")).toBeInTheDocument();
    });

    // 백드롭 클릭 (모달 전체 wrapper 중 바깥 영역 클릭)
    fireEvent.click(container.firstChild as HTMLElement);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "닫기 버튼 테스트" } },
    });

    render(<FeedbackModal name="홍길동" onClose={mockOnClose} scoreSummaryId={4} />);

    await waitFor(() => {
      expect(screen.getByText("닫기")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("닫기"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
