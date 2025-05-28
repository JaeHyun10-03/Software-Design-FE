import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modal from "./Modal";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Modal", () => {
  const onCloseMock = jest.fn();
  const scoreSummaryId = 1;

  beforeEach(() => {
    localStorage.setItem("accessToken", "mocked-token");
    jest.clearAllMocks(); // 🔥 여기서 모든 mock 초기화
    onCloseMock.mockClear();
  });

  it("제목과 textarea, 버튼이 렌더링된다", () => {
    render(<Modal name="홍길동" onClose={onCloseMock} scoreSummaryId={scoreSummaryId} />);
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("피드백을 작성해주세요")).toBeInTheDocument();
    expect(screen.getByText("닫기")).toBeInTheDocument();
  });

  it("기존 피드백이 있으면 불러와서 textarea에 표시된다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "기존 피드백입니다." } },
    });

    render(<Modal name="홍길동" onClose={onCloseMock} scoreSummaryId={scoreSummaryId} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("기존 피드백입니다.")).toBeInTheDocument();
    });
  });

  it("기존 피드백이 없고, 새 피드백을 작성하면 post 요청이 발생한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: null } },
    });
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Modal name="홍길동" onClose={onCloseMock} scoreSummaryId={scoreSummaryId} />);
    const textarea = await screen.findByPlaceholderText("피드백을 작성해주세요");
    fireEvent.change(textarea, { target: { value: "새 피드백 작성" } });
    fireEvent.click(screen.getByText("닫기"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("피드백을 수정하면 edit 요청이 발생한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "이전 피드백" } },
    });
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Modal name="홍길동" onClose={onCloseMock} scoreSummaryId={scoreSummaryId} />);
    const textarea = await screen.findByDisplayValue("이전 피드백");

    fireEvent.change(textarea, { target: { value: "수정된 피드백" } });
    fireEvent.click(screen.getByText("닫기"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("피드백 변경이 없으면 요청 없이 onClose만 호출된다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { feedback: "변경 없음" } },
    });

    render(<Modal name="홍길동" onClose={onCloseMock} scoreSummaryId={scoreSummaryId} />);
    await screen.findByDisplayValue("변경 없음");

    fireEvent.click(screen.getByText("닫기"));

    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
