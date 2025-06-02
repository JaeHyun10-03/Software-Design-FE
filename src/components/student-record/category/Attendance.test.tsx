import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Attendance from "@/components/student-record/category/Attendance";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";

jest.mock("axios");

// zustand store mocking
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Attendance Component", () => {
  beforeEach(() => {
    (useStudentFilterStore as unknown as jest.Mock).mockReturnValue({
      grade: 1,
      classNumber: 2,
      studentNumber: 3,
    });

    (useSelectedDate as unknown as jest.Mock).mockReturnValue({
      year: 2024,
      month: 5,
      semester: 1,
    });

    localStorage.setItem("accessToken", "mocked-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("출결 데이터를 불러오는 동안 로딩 메시지를 보여준다", () => {
    (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Attendance />);
    expect(screen.getByText("출결 통계 데이터를 불러오는 중...")).toBeInTheDocument();
  });

  it("API 에러 발생 시 에러 메시지를 보여준다", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API 실패")); // summary
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API 실패")); // feedback

    render(<Attendance />);
    await waitFor(() => {
      expect(screen.getByText(/올바른 학년, 반을 적용해주세요/i)).toBeInTheDocument();
    });
  });

  it("출결 통계를 정상적으로 렌더링한다", async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/summary")) {
        return Promise.resolve({
          data: {
            response: {
              absentDays: 2,
              lateDays: 1,
              leaveEarlyDays: 3,
              presentDays: 20,
              studentId: 123,
              studentName: "홍길동",
              totalSchoolDays: 26,
            },
          },
        });
      }
      if (url.includes("/feedback")) {
        return Promise.resolve({
          data: {
            response: {
              feedback: "피드백 내용",
              feedbackId: "abc123",
            },
          },
        });
      }
    });

    render(<Attendance />);
    expect(await screen.findByText("출석")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByDisplayValue("피드백 내용")).toBeInTheDocument();
  });

  it("피드백이 없을 때 새 피드백을 저장한다 (POST)", async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/summary")) {
        return Promise.resolve({
          data: {
            response: {
              absentDays: 1,
              lateDays: 1,
              leaveEarlyDays: 1,
              presentDays: 22,
              studentId: 321,
              studentName: "김철수",
              totalSchoolDays: 25,
            },
          },
        });
      }
      if (url.includes("/feedback")) {
        return Promise.resolve({
          data: {
            response: {
              feedback: "",
              feedbackId: "",
            },
          },
        });
      }
    });

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        response: {
          feedbackId: "new123",
        },
      },
    });

    render(<Attendance />);

    const editButton = await screen.findByText("수정");
    fireEvent.click(editButton);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "새로운 피드백입니다." } });

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText("피드백이 저장되었습니다.")).toBeInTheDocument();
    });
  });

  it("피드백이 있을 때 기존 피드백을 수정한다 (PUT)", async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/summary")) {
        return Promise.resolve({
          data: {
            response: {
              absentDays: 0,
              lateDays: 0,
              leaveEarlyDays: 0,
              presentDays: 25,
              studentId: 444,
              studentName: "이영희",
              totalSchoolDays: 25,
            },
          },
        });
      }
      if (url.includes("/feedback")) {
        return Promise.resolve({
          data: {
            response: {
              feedback: "기존 피드백",
              feedbackId: "exists123",
            },
          },
        });
      }
    });

    (axios.put as jest.Mock).mockResolvedValue({});

    render(<Attendance />);

    const editButton = await screen.findByText("수정");
    fireEvent.click(editButton);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "수정된 피드백" } });

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(screen.getByText("피드백이 수정되었습니다.")).toBeInTheDocument();
    });
  });
});
