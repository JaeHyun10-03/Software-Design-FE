import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CounselList from "./CounselList";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CounselList 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("axios 요청 성공 시 상담 카드들을 렌더링한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: [
          {
            id: 1,
            dateTime: "2024-05-26T14:30:00",
            category: "상담 주제",
            teacher: "홍길동",
            content: "상담 내용입니다.",
            nextPlan: "향후 계획입니다.",
            isPublic: true,
          },
        ],
      },
    });

    render(<CounselList />);

    // 날짜 텍스트가 렌더링될 때까지 기다림
    await waitFor(() => expect(screen.getByText(/2024년 5월 26일 14:30/)).toBeInTheDocument());

    // 내용이 기본적으로 숨겨져 있으므로, 클릭 이벤트를 발생시켜 내용을 보여줌
    fireEvent.click(screen.getByText(/2024년 5월 26일 14:30/));

    // 이제 상담 내용과 향후 계획 텍스트가 보여야 함
    expect(screen.getByText("상담 내용입니다.")).toBeInTheDocument();
    expect(screen.getByText("향후 계획입니다.")).toBeInTheDocument();
  });
});
